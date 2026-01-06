import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASSWORD!,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    isConnected = true;
  } catch (error) {
    console.error("Connection error:", error);
    throw error;
  }
};

export default sequelize;