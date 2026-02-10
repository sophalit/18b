import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || "localhost",
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || "shopuser",
  password: process.env.DATABASE_PASSWORD || "shoppass",
  database: process.env.DATABASE_NAME || "shopdb",
  waitForConnections: true,
  connectionLimit: 10,
});
