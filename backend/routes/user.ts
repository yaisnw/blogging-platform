import express from "express";
import { User } from "../sequelize/models/User";
import { getUser, deleteUser, updateUser, changePassword, changeAvatar } from "../controllers/userController";
import multer from "multer";

const upload = multer();
const userRouter = express.Router();

userRouter.put('/:id/avatar', upload.single('image'), changeAvatar)
userRouter.put('/change-password', changePassword)  

userRouter.get('/:id',  getUser)
userRouter.put('/:id', updateUser) 
userRouter.delete('/:id', deleteUser)

export default userRouter