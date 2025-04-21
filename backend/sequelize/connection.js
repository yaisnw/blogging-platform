"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@sequelize/core");
const postgres_1 = require("@sequelize/postgres");
const user_1 = require("./models/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sequelize = new core_1.Sequelize({
    dialect: postgres_1.PostgresDialect,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    ssl: true,
    models: [user_1.User],
    clientMinMessages: 'notice',
});
exports.default = sequelize;
