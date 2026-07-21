import { NextFunction, Request, Response } from "express"
import { postRequestBody } from "../types/controllerTypes"
import { AuthRequest } from "../types/controllerTypes"
import { CustomError } from "../types/controllerTypes"
import { Comment, Post, User, Picture } from "../sequelize/models"
import { Op, Sequelize } from "sequelize"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import s3 from "../s3"

// The FK cascade removes Picture ROWS when a post is deleted, but the S3 objects
// have no link to Postgres and would leak. Delete the files BEFORE destroying the
// posts, while the imageUrls are still queryable. Best-effort: a failed S3 delete
// is logged but doesn't block post deletion (avoids wedging deletes on stale files).
const deleteS3ObjectsForPosts = async (postIds: number[]): Promise<void> => {
    if (postIds.length === 0) return;
    const pictures = await Picture.findAll({ where: { postId: { [Op.in]: postIds } } });
    await Promise.all(pictures.map(async (pic) => {
        try {
            const key = new URL(pic.imageUrl).pathname.slice(1);
            await s3.send(new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: key,
            }));
        } catch (err) {
            console.error(`Failed to delete S3 object for picture ${pic.id}:`, err);
        }
    }));
};

export const addPost = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { title, content, status } = req.body;
    if (status === 'published') {
        if (!title || !content) {
            const err = new Error("Title and content fields cannot be empty") as CustomError;
            err.status = 400;
            return next(err)
        }
    }

    try {
        const newPost = await Post.create({
            authorId: req.user?.id,
            title,
            content,
            status,
        });
        if (!newPost) {
            const err = new Error("Post creation failed") as CustomError;
            err.status = 400;
            throw (err)
        }
        res.status(201).json(newPost)
    }
    catch (err) {
        next(err)
    }
}

export const getPostById = async (
    req: AuthRequest<any, any, any, { q?: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params;
    const userId = req.user?.id ? Number(req.user.id) : 0;

    if (!id) {
        const err = new Error("Please provide an id for the post") as CustomError;
        err.status = 400;
        return next(err)
    }

    try {
        const post = await Post.findOne(
            {
                where: { id },
                attributes: {
                    include: [[
                        Sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes."postId" = "Post"."id")`),
                        "likeCount"
                    ],
                    [
                        Sequelize.literal(`(
                        EXISTS(SELECT 1 FROM likes 
                        WHERE likes."postId" = "Post"."id" 
                        AND likes."userId" = ${userId}
                        ))`),
                        "hasLiked"
                    ]]
                },
                include: [
                    {
                        model: User,
                        attributes: ["id", "username", "avatar_url"],
                    },
                ]
            },

        )
        if (!post) {
            const err = new Error("Post does not exist") as CustomError;
            err.status = 404
            throw err
        }
        res.status(200).json(post)
    }
    catch (err) {
        next(err)
    }
}

export const getAllPostsByAuthorId = async (
    req: Request<{ authorId: number }, {}, postRequestBody, { publishedOnly?: string, sort?: string, page?: string, limit?: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const authorId = req.params.authorId;
    const { publishedOnly, sort, page, limit } = req.query;

    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '10');
    const offset = (pageNum - 1) * limitNum;

    let orderClause: any[] = [['createdAt', 'DESC']];
    if (sort === 'oldest') orderClause = [['createdAt', 'ASC']];
    else if (sort === 'status') orderClause = [['status', 'ASC']];
    else if (sort === 'likes') orderClause = [[Sequelize.literal('"likeCount"'), 'DESC']];
    else if (sort === 'comments') orderClause = [[Sequelize.literal('"commentCount"'), 'DESC']];

    try {
        const { count, rows: posts } = await Post.findAndCountAll({
            where: {
                authorId,
                ...(publishedOnly === "true" ? { status: "published" } : {})
            },
            order: orderClause,
            limit: limitNum,
            offset: offset,
            distinct: true,
            attributes: {
                include: [
                    [Sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes."postId" = "Post"."id")`), "likeCount"],
                    [Sequelize.literal(`(SELECT COUNT(*) FROM comments WHERE comments."postId" = "Post"."id")`), "commentCount"],
                    [Sequelize.literal(`EXISTS(SELECT 1 FROM likes WHERE likes."postId" = "Post"."id" AND likes."userId" = ${authorId || 0})`), "hasLiked"],
                ],
            },
            include: [{ model: User, attributes: ["id", "username", "avatar_url"] }],
        });

        return res.status(200).json({
            message: posts.length === 0 ? "No posts found" : "Posts retrieved",
            posts,
            totalCount: count
        });
    } catch (err) {
        next(err);
    }
};

export const getAllPublishedPosts = async (
    req: AuthRequest<any, any, any, { sort?: string, page?: string, limit?: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.user?.id ? Number(req.user.id) : 0;
    const { sort, page, limit } = req.query;

    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '10');
    const offset = (pageNum - 1) * limitNum;

    let orderClause: any[] = [['createdAt', 'DESC']];
    if (sort === 'oldest') orderClause = [['createdAt', 'ASC']];
    else if (sort === 'likes') orderClause = [[Sequelize.literal('"likeCount"'), 'DESC']];
    else if (sort === 'comments') orderClause = [[Sequelize.literal('"commentCount"'), 'DESC']];

    try {
        const { count, rows: posts } = await Post.findAndCountAll({
            where: { status: "published" },
            order: orderClause,
            limit: limitNum,
            offset: offset,
            distinct: true,
            attributes: {
                include: [
                    [Sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes."postId" = "Post"."id")`), "likeCount"],
                    [Sequelize.literal(`(SELECT COUNT(*) FROM comments WHERE comments."postId" = "Post"."id")`), "commentCount"],
                    [Sequelize.literal(`(SELECT EXISTS (SELECT 1 FROM likes WHERE likes."postId" = "Post"."id" AND likes."userId" = ${userId}))`), "hasLiked"],
                ],
            },
            include: [{ model: User, attributes: ["id", "username", "avatar_url"] }],
        });

        return res.status(200).json({ posts, totalCount: count });
    } catch (err) {
        next(err);
    }
};

export const getPostDetails = async (
    req: AuthRequest<any, any, any, { page?: string, limit?: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params;
    const { page, limit } = req.query;
    const userId = req.user?.id ? Number(req.user.id) : 0;

    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '10');
    const offset = (pageNum - 1) * limitNum;

    if (!id) {
        const err = new Error("Please provide a post id") as CustomError;
        err.status = 400;
        return next(err);
    }

    try {
        const post = await Post.findOne({
            where: { id },
            attributes: {
                include: [
                    [Sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes."postId" = "Post"."id")`), "likeCount"],
                    [Sequelize.literal(`(EXISTS(SELECT 1 FROM likes WHERE likes."postId" = "Post"."id" AND likes."userId" = ${userId}))`), "hasLiked"]
                ]
            },
            include: [{ model: User, attributes: ["id", "username", "avatar_url"] }]
        });

        if (!post) {
            const err = new Error("Post does not exist") as CustomError;
            err.status = 404;
            throw err;
        }

        const { count: totalComments, rows: comments } = await Comment.findAndCountAll({
            where: { postId: id },
            include: [{ model: User, attributes: ["id", "username", "avatar_url"] }],
            order: [['createdAt', 'DESC']],
            limit: limitNum,
            offset: offset
        });

        res.status(200).json({ post, comments, totalComments });
    } catch (err) {
        next(err);
    }
};

export const searchPosts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { q } = req.query;
    const userId = req.user?.id ? Number(req.user.id) : 0;

    if (!q || q.trim() === "") {
        return res.status(400).json({ message: "Search query is required" });
    }

    try {
        const posts = await Post.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${q}%` } },
                    { content: { [Op.iLike]: `%${q}%` } }
                ],
                status: "published",
            },
            order: [['createdAt', 'DESC']],
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes."postId" = "Post"."id")`),
                        "likeCount",
                    ],
                    [
                        Sequelize.literal(`EXISTS(SELECT 1 FROM likes WHERE likes."postId" = "Post"."id" AND likes."userId" = ${userId})`),
                        "hasLiked",
                    ],
                ],
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "username", "avatar_url"],
                },
            ],
        });

        return res.status(200).json({
            message: posts.length === 0 ? "No posts found" : "Posts retrieved",
            posts,
        });
    } catch (err) {
        next(err);
    }
};

export const updatePost = async (
    req: AuthRequest<{ id: number }, {}, postRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params;
    const { title, content, status, likes } = req.body
    if (!id) {
        const err = new Error("Please provide an id for the post") as CustomError;
        err.status = 400;
        return next(err);
    }
    try {
        // Scope the update to the caller's own post. Without authorId here, any
        // logged-in user could overwrite any post by id (IDOR).
        const [affectedCount, updatedPosts] = await Post.update(
            {
                ...(title && { title }),
                ...(content && { content }),
                ...(status && { status }),
                ...(likes && { likes }),
            },
            {
                where: { id, authorId: req.user?.id },
                returning: true,
            }
        );

        if (affectedCount !== 0) {
            return res.status(200).json(updatedPosts[0]);
        } else {
            const err = new Error("Post could not be edited") as CustomError;
            err.status = 400;
            throw err;
        }
    }
    catch (err) {
        next(err)
    }
}

export const deletePosts = async (
    req: AuthRequest<{}, {}, { postIds: number[] }, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { postIds } = req.body;
    if (!postIds || postIds.length === 0) {
        const err = new Error("Please provide an array of post IDs") as CustomError;
        err.status = 400;
        return next(err);
    }

    try {
        // Restrict to the caller's own posts, then clean up S3 files before the
        // cascade drops the Picture rows (which is where the imageUrls live).
        const owned = await Post.findAll({
            where: { id: { [Op.in]: postIds }, authorId: req.user?.id },
            attributes: ['id'],
        });
        const ownedIds = owned.map((p) => p.id);

        await deleteS3ObjectsForPosts(ownedIds);

        const deletedCount = await Post.destroy({
            where: { id: { [Op.in]: ownedIds }, authorId: req.user?.id }
        });

        if (deletedCount > 0) {
            return res.status(200).json({
                message: `Successfully deleted ${deletedCount} post(s)`,
                deletedCount
            });
        } else {
            const err = new Error("No posts found with the given IDs") as CustomError;
            err.status = 404;
            throw err;
        }
    } catch (err) {
        next(err);
    }
};

export const deleteAllPostsByAuthorId = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const posts = await Post.findAll({ where: { authorId: req.user?.id }, attributes: ['id'] });
        await deleteS3ObjectsForPosts(posts.map((p) => p.id));

        const deletedPosts = await Post.destroy({ where: { authorId: req.user?.id } });
        if (deletedPosts !== 0) {
            return res.status(200).json({ message: "Posts deleted successfully" })
        }
        else {
            const err = new Error("Could not delete posts") as CustomError;
            err.status = 404;
            throw err
        }
    }
    catch (err) {
        next(err)
    }
}