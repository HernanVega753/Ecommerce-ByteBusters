import mysql from "mysql2/promise";
import dotenv from 'dotenv';

dotenv.config(); // Cargar las variables de entorno

// Descomponer la URL de conexión
const dbUrl = new URL(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: dbUrl.hostname,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.substring(1), // Quitar el primer '/' de la ruta
  port: dbUrl.port || 3306,
  connectTimeout: 60000,
});

export default pool;
