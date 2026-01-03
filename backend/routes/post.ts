import express from "express";
import { deleteAllPostsByAuthorId, deletePosts, getAllPostsByAuthorId, getPostById, addPost, updatePost, getAllPublishedPosts, searchPosts, getPostDetails } from "../controllers/postController";
const postRouter = express.Router();

postRouter.post('/create', addPost);
postRouter.get('/search', searchPosts);
postRouter.get('/getAllPosts/:authorId?', getAllPostsByAuthorId);
postRouter.get('/getAllPublishedPosts', getAllPublishedPosts)
postRouter.get('/details/:id', getPostDetails);
postRouter.get('/:id', getPostById);
postRouter.put('/update/:id', updatePost);
postRouter.delete('/deletePosts', deletePosts);
postRouter.delete('/deleteAllPosts', deleteAllPostsByAuthorId);

export default postRouter   