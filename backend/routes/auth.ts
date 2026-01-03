import express from "express";
import { googleOAuth, loginUser, signUpUser } from "../controllers/authController";
const authRouter = express.Router();

authRouter.post('/signup', signUpUser);
authRouter.post('/login', loginUser);
authRouter.post('/googleOAuth', googleOAuth)

export default authRouter   