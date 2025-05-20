import express, { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import sequelize from "./sequelize/connection";
import SequelizeStoreInit from "connect-session-sequelize";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import postRouter from "./routes/post";
import session from "express-session";
import { initModels } from "./sequelize/models/index";
import commentRouter from "./routes/comment";

export interface CustomError extends Error {
  status: number;
  payload: any
}

dotenv.config();

const app = express();
const SequelizeStore = SequelizeStoreInit(session.Store);
const store = new SequelizeStore({
  db: sequelize,
});

store.sync();

const PORT = process.env.PORT || 3000;
app.use(
  session({
    name: "rid",
    secret: process.env.SESSION_SECRET || "default_secret",
    store: store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.user) next()
  else {
    const err = new Error("Please log in first") as CustomError
    err.status = 401
    next(err)
  }
}

app.use(express.json());
app.use('/auth', authRouter);
app.use('/user', isAuthenticated, userRouter);
app.use('/post', isAuthenticated, postRouter);
app.use('/comment', isAuthenticated, commentRouter);
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
