// corsMiddleware.js
import cors from 'cors';

const corsMiddleware = cors({
    origin: 'http://localhost:3000',  // Cambia esto por la URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'] // Encabezados permitidos
});

export default corsMiddleware;
