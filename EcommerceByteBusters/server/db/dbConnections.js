import mysql from "mysql2/promise";
import config from '../../config.js';

// Depuración: Mostrar valores de las variables de entorno
console.log("=== Depuración de Variables de Entorno ===");
console.log("DB Host:", config.db.host || 'localhost');
console.log("DB User:", config.db.user || 'root');
console.log("DB Password:", config.db.password ? "Cargada" : "No definida"); // Oculta el valor de la contraseña
console.log("DB Name:", config.db.database || 'constructora');
console.log("JWT Secret:", config.jwtSecret ? "Cargada" : "No definida");
console.log("MercadoPago Token:", config.mercadoPagoToken ? "Cargado" : "No definido");
console.log("Puerto:", config.PORT || "No definido");

console.log("=== Fin de Depuración de Variables de Entorno ===");

// Crear un pool de conexiones a la base de datos usando `config`
const pool = mysql.createPool({
  host: config.db.host || 'localhost',
  user: config.db.user || 'root',
  password: config.db.password || '44057662Nicol',
  database: config.db.database || 'constructora',
  connectTimeout: 60000  // Aumenta el tiempo de espera a 60 segundos
});

// Exportar el pool de conexiones
export default pool;

