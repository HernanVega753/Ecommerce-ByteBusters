import mysql from "mysql2/promise";
import config from '../../config.js';


// Crear un pool de conexiones a la base de datos usando `config`
const pool = mysql.createPool({
  host: config.db.host || 'localhost',
  user: config.db.user || 'root',
  password: config.db.password || '44057662Nicol',
  database: config.db.database || 'constructora'
});

// Exportar el pool de conexiones
export default pool;
