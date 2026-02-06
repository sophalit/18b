import mysql from 'mysql2/promise';
import { config } from './index';

let pool: mysql.Pool | null = null;

export const getPool = (): mysql.Pool => {
  if (!pool) {
    pool = mysql.createPool({
      host: config.database.host,
      port: config.database.port,
      user: config.database.user,
      password: config.database.password,
      database: config.database.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
};

export const query = async <T = any>(sql: string, params?: any[]): Promise<T> => {
  const pool = getPool();
  const [rows] = await pool.execute(sql, params);
  return rows as T;
};
