/// <reference path="./types/xss-clean.d.ts" />
import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";

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
import { AuthRequest } from "./types/controllerTypes";
import { verifyJWT } from "middleware/verifyJWT";

console.log("SERVER BOOTING UP");

initModels(sequelize);

const app = express();

app.set('trust proxy', 1);

app.use(cors({
  origin: ["https://blogging-platform-pearl-six.vercel.app", "https://blogging-platform-frontend-bnasrdnrv.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
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




app.use(apiLimiter);

app.use('/auth', authLimiter, authRouter);
app.use('/user', verifyJWT, userRouter);
app.use('/post', postRouter);
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