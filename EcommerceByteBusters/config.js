import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de .env en process.env

export default {
    DATABASE_URL: process.env,
    jwtSecret: process.env.JWT_SECRET,
    mercadoPagoToken: process.env.ACCESS_TOKEN,
    PORT: process.env.PORT
};