/// <reference path="./types/xss-clean.d.ts" />
import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import sequelize from "./sequelize/connection";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import { initModels } from "./sequelize/models/index";
import commentRouter from "./routes/comment";
import pictureRouter from "./routes/picture";
import cors from "cors"
import jwt from "jsonwebtoken"
import likeRouter from "./routes/like";
import { authLimiter, apiLimiter } from "./middleware/rateLimiter"
import helmet from "helmet";
import xss from "xss-clean";
import { CustomError } from "./types/controllerTypes";
import { connectDB } from "./sequelize/connection";


interface AuthUser {
  id: number;
  email: string;
  username: string;
}

export interface AuthRequest<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: AuthUser;
  file?: Express.Multer.File;
}

initModels(sequelize);

const app = express();

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

dotenv.config();


const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://blogging-platform-pearl-six.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.options('*', cors());
app.set('trust proxy', 1);


app.use(express.static('dist'));
app.use(helmet());
app.use(xss());
app.use(express.json());
app.use(apiLimiter)

export const verifyJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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


app.use('/auth', authLimiter, authRouter);
app.use('/user', verifyJWT, userRouter);
app.use('/post', verifyJWT, postRouter);
app.use('/comment', verifyJWT, commentRouter);
app.use('/picture', verifyJWT, pictureRouter)
app.use('/like', verifyJWT, likeRouter)
app.use((
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.status || 400).send({ message: err.message, payload: err.payload })
})

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});



export default app;