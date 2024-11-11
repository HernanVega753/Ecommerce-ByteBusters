import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de .env en process.env

export default {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    jwtSecret: process.env.JWT_SECRET,
    mercadoPagoToken: process.env.ACCESS_TOKEN,
    PORT: process.env.PORT
};

if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
    throw new Error("Faltan variables de entorno necesarias para la base de datos.");
}
if (!process.env.JWT_SECRET) {
    throw new Error("Falta la variable de entorno JWT_SECRET.");
}
if (!process.env.ACCESS_TOKEN) {
    throw new Error("Falta la variable de entorno ACCESS_TOKEN.");
}
