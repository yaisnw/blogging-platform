import express from "express";
import { addComment, deleteAllCommentsByAuthorId, deleteCommentById, editComment, getCommentById, getCommentsByAuthorId, getCommentsByPostId } from "../controllers/commentController";
const commentRouter = express.Router();

commentRouter.get('/author/:authorId?', getCommentsByAuthorId);
commentRouter.delete('/author/:authorId', deleteAllCommentsByAuthorId);
commentRouter.post('/', addComment);
commentRouter.get('/:id', getCommentById);
commentRouter.get('/post/:postId', getCommentsByPostId);
commentRouter.put('/:id', editComment);
commentRouter.delete('/:id', deleteCommentById);

export default commentRouter