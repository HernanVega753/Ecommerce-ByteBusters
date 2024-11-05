import mysql from "mysql2/promise";

// Crear un pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user:   process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'constructora'
});

// Exportar el pool de conexiones
export default pool;
