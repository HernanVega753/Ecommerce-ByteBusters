import mysql from "mysql2/promise";
import config from '../../config.js';


const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, // Utiliza la URL completa proporcionada por Railway
  connectTimeout: 60000,
});

export default pool;

