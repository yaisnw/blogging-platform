import express from "express";
import { User } from "../sequelize/models/user";
import { loginUser, logout, registerUser } from "../controllers/authController";
const authRouter = express.Router();

authRouter.post('/signup', registerUser); 
authRouter.post('/login', loginUser);
authRouter.get('/logout', logout);

export default authRouter   