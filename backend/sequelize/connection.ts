import { Sequelize } from "@sequelize/core";
import { PostgresDialect } from "@sequelize/postgres";
import { User } from "./models/user";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  ssl: true,
  models: [User],
  clientMinMessages: 'notice',
});

export default sequelize;