import { NextFunction, Request, Response } from "express"
import { postRequestBody } from "../types/controllerTypes"
import { CustomError, AuthRequest } from "../index"
import { Comment, Post, User } from "../sequelize/models"
import { Op } from "sequelize"

export const addPost = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { title, content, status } = req.body;
    if (status === 'completed') {
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
    req: Request<{ id: number }, {}, postRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params

    if (!id) {
        const err = new Error("Please provide an id for the post") as CustomError;
        err.status = 400;
        return next(err)
    }

    try {
        const post = await Post.findOne({ where: { id } })
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
    req: Request<{ authorId: number }, {}, postRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    let authorId;
    authorId = req.params.authorId;
    try {
        const author = await User.findOne({
            where: {
                id: authorId
            }
        })
        const posts = await Post.findAll({
            where: {
                authorId,
            }
        })
        if (!author) {
            const err = new Error('Author could not be found') as CustomError
            err.status = 404
            throw err
        }
        else {
            return res.status(200).json({
                message: posts.length === 0
                    ? "No posts found for this author."
                    : "Posts retrieved successfully",
                posts: posts,
                author: author.username
            });
        }
    }
    catch (err) {
        next(err)
    }
}

export const getAllCompletedPosts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const posts = await Post.findAll({
      where: {
        status: "completed",
      },
      include: [
        {
          model: User,
          attributes: ["username"], 
        },
      ]
    });
    if (posts.length === 0) {
      return res.status(200).json({
        message: "No completed posts found.",
        posts: [],
      });
    }

    return res.status(200).json({
      message: "Completed posts retrieved successfully",
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
        const editedPost = await Post.update(
            {
                ...(title && { title }),
                ...(content && { content }),
                ...(status && { status }),
                ...(likes && { likes })
            },
            {
                where: {
                    id
                }
            }
        )
        if (editedPost[0] !== 0) {
            res.status(201).json({ message: "Post updated successfully" })
        }
        else {
            const err = new Error("Post could not be edited") as CustomError;
            err.status = 400;
            throw err
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
