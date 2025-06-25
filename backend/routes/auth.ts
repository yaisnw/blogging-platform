import express from "express";
import { User } from "../sequelize/models/user";
import { loginUser, logout, signUpUser } from "../controllers/authController";
const authRouter = express.Router();

authRouter.post('/signup', signUpUser); 
authRouter.post('/login', loginUser);
authRouter.get('/logout', logout);

export default authRouter   