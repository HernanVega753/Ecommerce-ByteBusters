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
    mercadoPagoToken: process.env.MERCADO_PAGO_ACCESS_TOKEN
};
