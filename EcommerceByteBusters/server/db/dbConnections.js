import mysql from "mysql2/promise";

// Crear un pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user:   process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '44057662Nicol',
  database: process.env.DB_NAME || 'constructora'
});

// Exportar el pool de conexiones
export default pool;

connection.connect(function (err) {
  if (err) {
      console.error('Error de conexión: ' + err.stack);
      return;
  }
  console.log('Conectado a la base de datos como id ' + connection.threadId);
});

module.exports = connection;