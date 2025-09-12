import express, {  NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import sequelize from "./sequelize/connection";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import session from "express-session";
import { initModels } from "./sequelize/models/index";
import commentRouter from "./routes/comment";
import pictureRouter from "./routes/picture";
import cors from "cors"
import jwt from "jsonwebtoken"
import likeRouter from "./routes/like";

export interface CustomError extends Error {
  status: number;
  payload: any
}

export interface AuthRequest extends Request {
  user?: { id: number; email: string; username: string };
}

dotenv.config();

const app = express();


const PORT = process.env.PORT || 3000;

app.use(cors(
  {
    origin: 'http://localhost:5173',
    credentials: true
  }
))

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

app.use(express.json());
app.use('/auth', authRouter);
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
  res.status(err.status || 400).send({message: err.message, payload: err.payload})
})

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    initModels(sequelize);
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
