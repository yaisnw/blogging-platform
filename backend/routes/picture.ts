import express from "express";
import { addPictureWithPost, deletePictureByUrl, deletePicturesByPostId, getAllPicturesByPostId } from "../controllers/pictureController";
import multer from "multer";

const upload = multer();
const pictureRouter = express.Router()

pictureRouter.post('/', upload.single('image'), addPictureWithPost);
pictureRouter.get('/post/:postId', getAllPicturesByPostId);
pictureRouter.delete('/deleteByUrl', deletePictureByUrl)
pictureRouter.delete('/post/:postId', deletePicturesByPostId);

export default pictureRouter