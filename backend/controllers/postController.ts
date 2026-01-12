import { NextFunction, Request, Response } from "express"
import { postRequestBody } from "../types/controllerTypes"
import { AuthRequest } from "../types/controllerTypes"
import { CustomError } from "../types/controllerTypes"
import { Comment, Post, User } from "../sequelize/models"
import { Op, Sequelize } from "sequelize"

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
    req: Request<{ authorId: number }, {}, postRequestBody, { publishedOnly?: string, sort?: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const authorId = req.params.authorId;
    const { publishedOnly, sort } = req.query;

    let orderClause: any[] = [['createdAt', 'DESC']];

    if (sort === 'oldest') {
        orderClause = [['createdAt', 'ASC']];
    } else if (sort === 'status') {
        orderClause = [['status', 'ASC']];
    } else if (sort === 'likes') {
        orderClause = [[Sequelize.literal('"likeCount"'), 'DESC']];
    } else if (sort === 'comments') {
        orderClause = [[Sequelize.literal('"commentCount"'), 'DESC']];
    }

    try {
        const posts = await Post.findAll({
            where: {
                authorId,
                ...(publishedOnly === "true" ? { status: "published" } : {})
            },
            order: orderClause,
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes."postId" = "Post"."id")`),
                        "likeCount",
                    ],
                    [
                        Sequelize.literal(`(SELECT COUNT(*) FROM comments WHERE comments."postId" = "Post"."id")`),
                        "commentCount",
                    ],
                    [
                        Sequelize.literal(`EXISTS(SELECT 1 FROM likes WHERE likes."postId" = "Post"."id" AND likes."userId" = ${authorId || 0})`),
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
            message: posts.length === 0 ? "No posts found for this author." : "Posts retrieved successfully",
            posts,
        });
    } catch (err) {
        next(err);
    }
};

export const getAllPublishedPosts = async (
    req: AuthRequest<any, any, any, { sort?: string }>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const userId = req.user?.id ? Number(req.user.id) : 0;
    const { sort } = req.query;

    let orderClause: any[] = [['createdAt', 'DESC']];
    if (sort === 'oldest') orderClause = [['createdAt', 'ASC']];
    else if (sort === 'likes') orderClause = [[Sequelize.literal('"likeCount"'), 'DESC']];
    else if (sort === 'comments') orderClause = [[Sequelize.literal('"commentCount"'), 'DESC']];

    try {
        const posts = await Post.findAll({
            where: { status: "published" },
            order: orderClause,
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes."postId" = "Post"."id")`),
                        "likeCount"
                    ],
                    [
                        Sequelize.literal(`(SELECT COUNT(*) FROM comments WHERE comments."postId" = "Post"."id")`),
                        "commentCount"
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT EXISTS (
                                SELECT 1 FROM likes 
                                WHERE likes."postId" = "Post"."id" 
                                AND likes."userId" = ${userId}
                            )
                        )`),
                        "hasLiked"
                    ],
                ],
            },
            include: [{ model: User, attributes: ["id", "username", "avatar_url"] }],
        });

        return res.status(200).json({ posts });
    } catch (err) {
        next(err);
    }
};

export const getPostDetails = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params;
    const userId = req.user?.id ? Number(req.user.id) : 0;

    if (!id) {
        const err = new Error("Please provide a post id") as CustomError;
        err.status = 400;
        return next(err);
    }

    try {
        res.set('Cache-Control', 'public, max-age=60, s-maxage=60');

        const [post, comments] = await Promise.all([
            Post.findOne({
                where: { id },
                attributes: {
                    include: [
                        [
                            Sequelize.literal(`(SELECT COUNT(*) FROM likes WHERE likes."postId" = "Post"."id")`),
                            "likeCount"
                        ],
                        [
                            Sequelize.literal(`(EXISTS(SELECT 1 FROM likes WHERE likes."postId" = "Post"."id" AND likes."userId" = ${userId}))`),
                            "hasLiked"
                        ]
                    ]
                },
                include: [{ model: User, attributes: ["id", "username", "avatar_url"] }]
            }),
            Comment.findAll({
                where: { postId: id },
                include: [{ model: User, attributes: ["id", "username", "avatar_url"] }],
                order: [['createdAt', 'DESC']]
            })
        ]);

        if (!post) {
            const err = new Error("Post does not exist") as CustomError;
            err.status = 404;
            throw err;
        }

        res.status(200).json({ post, comments });
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
    req: Request<{ id: number }, {}, postRequestBody, {}>,
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
        const [affectedCount, updatedPosts] = await Post.update(
            {
                ...(title && { title }),
                ...(content && { content }),
                ...(status && { status }),
                ...(likes && { likes }),
            },
            {
                where: { id },
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
    req: Request<{}, {}, { postIds: number[] }, {}>,
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
        const deletedCount = await Post.destroy({
            where: { id: { [Op.in]: postIds } }
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