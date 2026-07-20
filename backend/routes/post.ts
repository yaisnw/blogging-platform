import express from "express";
import { deleteAllPostsByAuthorId, deletePosts, getAllPostsByAuthorId, getPostById, addPost, updatePost, getAllPublishedPosts, searchPosts, getPostDetails } from "../controllers/postController";
import { verifyJWT, optionalJWT } from "../middleware/verifyJWT";
const postRouter = express.Router();

postRouter.post('/create', verifyJWT, addPost);
postRouter.get('/search', searchPosts);
// These are public but personalise `hasLiked` from req.user.id. Without
// optionalJWT req.user is undefined, userId falls back to 0, and hasLiked is
// always false — the heart never shows as liked.
postRouter.get('/getAllPosts/:authorId?', optionalJWT, getAllPostsByAuthorId);
postRouter.get('/getAllPublishedPosts', optionalJWT, getAllPublishedPosts)
postRouter.get('/details/:id', optionalJWT, getPostDetails);
postRouter.get('/:id', optionalJWT, getPostById);
postRouter.put('/update/:id', verifyJWT, updatePost);
postRouter.delete('/deletePosts', verifyJWT, deletePosts);
postRouter.delete('/deleteAllPosts', verifyJWT, deleteAllPostsByAuthorId);

export default postRouter   