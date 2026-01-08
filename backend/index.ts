/// <reference path="./types/xss-clean.d.ts" />
import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import jwt from "jsonwebtoken";

import sequelize from "./sequelize/connection";
import { connectDB } from "./sequelize/connection";
import { initModels } from "./sequelize/models/index";

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import commentRouter from "./routes/comment";
import pictureRouter from "./routes/picture";
import likeRouter from "./routes/like";
import { authLimiter, apiLimiter } from "./middleware/rateLimiter";
import { CustomError } from "./types/controllerTypes";

console.log("SERVER BOOTING UP");

initModels(sequelize);

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: 'https://blogging-platform-pearl-six.vercel.app',
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin"],
}));

app.options('*', cors());

app.use(async (req, res, next) => {
  if (req.method === 'OPTIONS') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(authLimiter)

interface AuthUser {
  id: number;
  email: string;
  username: string;
}

export interface AuthRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> 
  extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: AuthUser;
  file?: Express.Multer.File;
}

export const verifyJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthRequest["user"];
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

app.use('/auth', authRouter);
app.use('/user', verifyJWT, userRouter);
app.use('/post', verifyJWT, postRouter);
app.use('/comment', verifyJWT, commentRouter);
app.use('/picture', verifyJWT, pictureRouter);
app.use('/like', verifyJWT, likeRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 400).send({ message: err.message, payload: err.payload });
});

export default app;