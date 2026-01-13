
import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
// @ts-ignore
import xss from "xss-clean";

import sequelize from "../sequelize/connection";
import { connectDB } from "../sequelize/connection";
import { initModels } from "../sequelize/models/index";
import authRouter from "../routes/auth";
import userRouter from "../routes/user";
import postRouter from "../routes/post";
import commentRouter from "../routes/comment";
import pictureRouter from "../routes/picture";
import likeRouter from "../routes/like";
import { authLimiter, apiLimiter } from "../middleware/rateLimiter";
import { CustomError } from "../types/controllerTypes";
import { verifyJWT } from "../middleware/verifyJWT";
import { CorsOptions } from "cors";

console.log("SERVER BOOTING UP");

initModels(sequelize);

const app = express();

app.set('trust proxy', 1);

const whitelist = [
  'https://blogging-platform-pearl-six.vercel.app',
  'https://blogging-platform-frontend-m6abcmq1i.vercel.app'
];
const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || whitelist.includes(origin) || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

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