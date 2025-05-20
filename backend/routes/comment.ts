import express from "express";
import { addComment, deleteAllCommentsByAuthorId, deleteCommentById, editComment, getCommentById, getCommentsByAuthorId, getCommentsByPostId } from "../controllers/commentController";
const commentRouter = express.Router();

commentRouter.get('/getCommentById/:id', getCommentById);
commentRouter.get('/getCommentsByAuthorId', getCommentsByAuthorId);
commentRouter.get('/getCommentsbyPostId', getCommentsByPostId);
commentRouter.post('/addComment', addComment);
commentRouter.put('/editCommentById/:id', editComment);
commentRouter.delete('/deleteCommentById/:id', deleteCommentById);
commentRouter.delete('/deleteCommentsByAuthorId', deleteAllCommentsByAuthorId);

export default commentRouter