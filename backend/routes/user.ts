import express from "express";
import { getUser, deleteUser, updateUser, changePassword, changeAvatar, searchUsers } from "../controllers/userController";
import multer from "multer";

const upload = multer();
const userRouter = express.Router();

userRouter.get('/search', searchUsers)
userRouter.put('/:id/avatar', upload.single('image'), changeAvatar)
userRouter.put('/change-password', changePassword)  
userRouter.get('/:id',  getUser)
userRouter.put('/:id', updateUser) 
userRouter.delete('/:id', deleteUser)

export default userRouter