import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de .env en process.env

// Loguea cada variable de entorno para verificar que se cargan correctamente
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("MERCADO_PAGO_TOKEN:", process.env.ACCESS_TOKEN);

export default {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
    mercadoPagoToken: process.env.ACCESS_TOKEN
};
