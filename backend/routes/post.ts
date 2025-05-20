import express from "express";
import { deleteAllPostsByAuthorId, deletePostById, getAllPostsByAuthorId, getPostById, addPost, editPost } from "../controllers/postController";
const postRouter = express.Router();

postRouter.post('/addPost', addPost);
postRouter.get('/getPost/:id', getPostById);
postRouter.get('/getAllPosts', getAllPostsByAuthorId);
postRouter.put('/update/:id', editPost);
postRouter.delete('/delete/:id', deletePostById);
postRouter.delete('/deleteAllPosts', deleteAllPostsByAuthorId);

export default postRouter