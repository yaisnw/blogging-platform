import express, { Request, Response } from "express";
import dotenv from "dotenv";
import sequelize from "./sequelize/connection";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());



app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
