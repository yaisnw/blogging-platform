import express from "express";
import { deleteAllPostsByAuthorId, deletePosts, getAllPostsByAuthorId, getPostById, addPost, updatePost, getAllPublishedPosts, searchPosts, getPostDetails } from "../controllers/postController";
import { verifyJWT } from "index";
const postRouter = express.Router();

postRouter.post('/create', verifyJWT, addPost);
postRouter.get('/search', searchPosts);
postRouter.get('/getAllPosts/:authorId?', getAllPostsByAuthorId);
postRouter.get('/getAllPublishedPosts', getAllPublishedPosts)
postRouter.get('/details/:id', getPostDetails);
postRouter.get('/:id', getPostById);
postRouter.put('/update/:id', verifyJWT, updatePost);
postRouter.delete('/deletePosts', verifyJWT, deletePosts);
postRouter.delete('/deleteAllPosts', verifyJWT, deleteAllPostsByAuthorId);

export default postRouter   