import express from "express";
import { deleteAllPostsByAuthorId, deletePosts, getAllPostsByAuthorId, getPostById, addPost, updatePost } from "../controllers/postController";
const postRouter = express.Router();

postRouter.post('/create', addPost);
postRouter.get('/getAllPosts/:authorId?', getAllPostsByAuthorId);
postRouter.get('/:id', getPostById);
postRouter.put('/update/:id', updatePost);
postRouter.delete('/deletePosts', deletePosts);
postRouter.delete('/deleteAllPosts', deleteAllPostsByAuthorId);

export default postRouter