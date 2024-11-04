import mysql from "mysql2/promise";

// Crear un pool de conexiones a la base de datos
// Acá van los datos de la Base de Datos en mySQL
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "constructora"
});

// Exportar el pool de conexiones
export default pool;
