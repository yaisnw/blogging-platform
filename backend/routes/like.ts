import express from "express";
import {
    addLike,
    removeLike,
    getLikesByPostId,
    getLikesByUserId,
} from "../controllers/likeController";

const likeRouter = express.Router();

likeRouter.post("/add", addLike);
likeRouter.delete("/remove", removeLike);
likeRouter.get("/post/:postId", getLikesByPostId);
likeRouter.get("/user/:userId", getLikesByUserId);

export default likeRouter;
