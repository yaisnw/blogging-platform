import express from "express";
import { User } from "../sequelize/models/User";
import { getUser, deleteUser } from "../controllers/userController";
const userRouter = express.Router();

userRouter.get('/:id', getUser)
userRouter.delete('/:id', deleteUser)

export default userRouter