import { NextFunction, Request, Response } from "express"
import { postRequestBody } from "../types/controllerTypes"
import { CustomError } from "../index"
import { Post } from "../sequelize/models"

export const addPost = async (
    req: Request<{}, {}, postRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { title, content, status } = req.body;

    if (!title || !content) {
        const err = new Error("Title and content fields cannot be empty") as CustomError;
        err.status = 400;
        throw err
    }

    try {
        const newPost = await Post.create({
            authorId: req.session.user?.id,
            title,
            content,
            ...(status && { status }),
        });
        if (!newPost) {
            const err = new Error("Post creation failed") as CustomError;
            err.status = 400;
            throw err
        }
        res.status(201).json({ msg: "Post successfully created", newPost })
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
        throw err
    }

    try {
        const post = await Post.findOne({ where: { id } })
        if (!post) {
            const err = new Error("Post does not exist") as CustomError;
            err.status = 404
            throw err
        }
        res.status(200).json({ msg: "Post retrieved successfully", post })
    }
    catch (err) {
        next(err)
    }
}

export const getAllPostsByAuthorId = async (
    req: Request<{}, {}, postRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {

        const posts = await Post.findAll({ where: { authorId: req.session.user!.id } })
        if (!posts) {
            const err = new Error("No posts by this author") as CustomError;
            err.status = 404
            throw err
        }
        res.status(200).json({ msg: "Posts retrieved successfully", posts })
    }
    catch (err) {
        next(err)
    }
}

export const editPost = async (
    req: Request<{ id: number }, {}, postRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params;
    const { title, content, status } = req.body
    if (!id) {
        const err = new Error("Please provide an id for the post") as CustomError;
        err.status = 400;
        throw err;
    }
    try {
        const editedPost = await Post.update(
            {
                ...(title && { title }),
                ...(content && { content }),
                ...(status && { status })
            },
            {
                where: {
                    id
                }
            }
        )
        if (editedPost[0] !== 0) {
            res.status(201).json({msg: "Post updated successfully"})
        }
        else {
            const err = new Error("Post could not be edited") as CustomError;
            err.status = 400;
            throw err
        }
    }
    catch(err){
        next(err)
    }
}

export const deletePostById = async (
    req: Request<{ id: number }, {}, postRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params;
    if (!id) {
        const err = new Error("Please provide an id for the post") as CustomError;
        err.status = 400;
        throw err;
    }
    try {
        const deletedPost = await Post.destroy({ where: { id } });
        if (deletedPost !== 0) {
            return res.status(200).json({ msg: "Post deleted successfully" })
        }
        else {
            const err = new Error("Post could not be deleted") as CustomError;
            err.status = 404;
            throw err;
        }
    }
    catch (err) {
        next(err)
    }
}

export const deleteAllPostsByAuthorId = async (
    req: Request<{}, {}, postRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const deletedPosts = await Post.destroy({ where: { authorId: req.session.user?.id } });
        if (deletedPosts !== 0) {
            return res.status(200).json({ msg: "Posts deleted successfully" })
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
