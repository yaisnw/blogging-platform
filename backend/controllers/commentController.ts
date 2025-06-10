import { Request, Response, NextFunction } from "express";
import { Comment } from "../sequelize/models";
import { CustomError } from "..";
import { commentRequestBody } from "../types/controllerTypes";

export const addComment = async (
    req: Request<{}, {}, commentRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const authorId = req.session.user?.id;
    const { postId } = req.body;
    const { content } = req.body;
    if(!postId) {
        const err = new Error("Please provide a post ID") as CustomError;
        err.status = 404;
        throw err
    }
    if (!content) {
        const err = new Error("Please enter the content for your comment") as CustomError;
        err.status = 404;
        throw err
    }
    try {
        const comment = await Comment.create({
            authorId,
            postId,
            content
        })
        if (!comment) {
            const err = new Error("Comment could not be created") as CustomError;
            err.status = 400;
            throw err
        }
        res.status(201).json({ msg: "Comment created successfully", comment })
    }
    catch (err) {
        next(err)
    }
}

export const getCommentById = async (
    req: Request<{ id: number }, {}, commentRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params;
    if (!id) {
        const err = new Error("Please provide comment ID") as CustomError;
        err.status = 400;
        throw err
    }
    try {
        const comment = await Comment.findOne({ where: { id } })
        if (!comment) {
            const err = new Error("Comment does not exist") as CustomError;
            err.status = 404;
            throw err
        }
        res.status(200).json({ comment })
    }
    catch (err) {
        next(err)
    }
}
export const getCommentsByPostId = async (
    req: Request<{postId: number}, {}, commentRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { postId } = req.params;
    if (!postId) {
        const err = new Error("Please provide post ID") as CustomError;
        err.status = 400;
        throw err
    }
    try {
        const comments = await Comment.findAll({ where: { postId } });
        if (!comments) {
            const err = new Error("Comment does not exist") as CustomError;
            err.status = 400;
            throw err
        }
        res.status(200).json({ comments })
    }
    catch (err) {
        next(err)
    }
}

export const getCommentsByAuthorId = async (
    req: Request<{authorId: number}, {}, commentRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    let authorId;
    if(req.params.authorId) {
        authorId = req.params.authorId
    }
    else{
        authorId = req.session.user?.id;
    }
    
    try {
        const comments = await Comment.findAll({ where: { authorId } });
        if (!comments) {
            const err = new Error("Comment does not exist") as CustomError;
            err.status = 400;
            throw err
        }
        res.status(200).json({ comments })
    }
    catch (err) {
        next(err)
    }
}

export const editComment = async (
    req: Request<{ id: number }, {}, commentRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params;
    const { content } = req.body;
    if (!id) {
        const err = new Error("Please provide an id for the comment") as CustomError;
        err.status = 400;
        throw err;
    }
    try {
        const editedComment = await Comment.update({
            content
        },
            {
                where: { id }
            }
        )
        if (editedComment[0] !== 0) {
            res.status(201).json({ msg: "Comment updated Successfully" })
        }
        else {
            const err = new Error("Comment could not be edited") as CustomError;
            err.payload = editedComment;
            err.status = 400;
            throw err
        }
    }
    catch (err) {
        next(err)
    }

}

export const deleteCommentById = async (
    req: Request<{ id: number }, {}, commentRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    const { id } = req.params;
    if (!id) {
        const err = new Error("Please provide an id for the comment") as CustomError;
        err.status = 400;
        throw err;
    }
    try {
        const deletedComment = await Comment.destroy({ where: { id } });
        if (deletedComment !== 0) {
            return res.status(200).json({ msg: "Comment deleted successfully" })
        }
        else {
            const err = new Error("Comment could not be deleted") as CustomError;
            err.status = 404;
            throw err;
        }
    }
    catch (err) {
        next(err)
    }
}

export const deleteAllCommentsByAuthorId = async (
    req: Request<{}, {}, commentRequestBody, {}>,
    res: Response,
    next: NextFunction
): Promise<Response | void> => {
    try {
        const deletedComments = await Comment.destroy({ where: { authorId: req.session.user?.id } });
        if (deletedComments !== 0) {
            return res.status(200).json({ msg: "Comments deleted successfully" })
        }
        else {
            const err = new Error("Could not delete comments") as CustomError;
            err.status = 404;
            throw err
        }
    }
    catch (err) {
        next(err)
    }
}