import mysql from "mysql2/promise";
import config from "../../config.js";

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'constructora',
  connectTimeout: 60000,
});

export default pool;

