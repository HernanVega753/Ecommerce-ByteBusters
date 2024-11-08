import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import clientesRoutes from "./routes/clientesRoutes.js";
import pool from "./db/dbConnections.js";  // Importa el pool de conexiones desde db.js
import jwt from 'jsonwebtoken';
import config from "../config.js";

const JWT_SECRET = config.jwtSecret;
import loggerMiddleware from "./middleware/loggerMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: config.mercadoPagoToken,
});

// Creación de tabla "clientes" y "mensaje" si no existen
async function createTables() {
    try {
        const connection = await pool.getConnection();

        const createTableQueryClientes = `
            CREATE TABLE IF NOT EXISTS clientes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                rol VARCHAR(50),
                usuario VARCHAR(50) NOT NULL,
                password VARCHAR(255) NOT NULL,
                telefono VARCHAR(20),
                email VARCHAR(100) NOT NULL
            )
        `;

        const createTableQueryMensajes = `
            CREATE TABLE IF NOT EXISTS mensajes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nombre VARCHAR(50) NOT NULL,
                correo VARCHAR(50) NOT NULL,
                mensaje VARCHAR(255)
            )
        `;

        await connection.execute(createTableQueryClientes);
        await connection.execute(createTableQueryMensajes);

        console.log("Tablas 'clientes' y 'mensajes' verificadas/creadas con éxito.");

        connection.release(); // Liberamos la conexión de vuelta al pool
    } catch (error) {
        console.error("Error al crear las tablas 'clientes' y 'mensajes':", error);
    }
}

// Ejecuta la creación de las tablas
createTables();

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usa las rutas de clientes
app.use("/clientes", clientesRoutes);

// Configura la carpeta 'client' como el directorio de archivos estáticos
app.use(express.static(path.join(__dirname, "..", 'client')));

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "..", 'client', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "register.html"));
});

app.post("/create_preference", async (req, res) => {
    try {
        const body = {
            items: [
                {
                    title: req.body.title,
                    quantity: Number(req.body.quantity),
                    unit_price: Number(req.body.price),
                    currency_id: "ARS",
                },
            ],
        };
        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({ id: result.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al crear la preferencia" });
    }
});

app.post('/verify-token', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.json({ isValid: false });
    }

    jwt.verify(token, JWT_SECRET, (err, authData) => {
        if (err) {
            return res.json({ isValid: false });
        }
        res.json({ isValid: true });
    });
});

app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
});
