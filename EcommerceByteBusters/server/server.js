import express from "express"; // framework para el lado del servidor
import cors from "cors"; // comunicación de las APIs
import path from 'path'; // uso de direcciones
import { fileURLToPath } from 'url'; // para poder usar direcciones con configuaración de módulos
import clientesRoutes from "./routes/clientesRoutes.js"; // Importa las rutas de clientes
import mysql from "mysql2/promise"; // permite el uso de promesas en mysql
import jwt from 'jsonwebtoken';

const JWT_SECRET='logueado';
import loggerMiddleware from "./middleware/loggerMiddleware.js"; // Punto medio que analiza los requerimientos
//import { verifyToken } from "./routes/clientesRoutes.js";

const __filename = fileURLToPath(import.meta.url); // definición manual de directorio y nombre de archivo (por el uso de módulo)
const __dirname = path.dirname(__filename); 

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { verify } from "crypto";
// Agrega credenciales
const client = new MercadoPagoConfig({ 
    accessToken: 'APP_USR-6878027478125365-091209-3cafa42ecdee0c015066a0c6bcc16ef6-1986448269', 
});


// Creación de tabla "clientes" y "mensaje" si no existe
async function createClientesTable() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user:   process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'constructora'
    });

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

    await connection.execute(createTableQueryClientes); // Ejecuta las querys
    await connection.execute(createTableQueryMensajes);


    await connection.end(); // cuando termina la conexión de forma exitosa da  un mensaje
    console.log("Tabla 'clientes/mensajes' verificada/creada con éxito.");
}

// Ejecuta la creación de la tabla
createClientesTable().catch(error => console.error("Error al crear la tabla 'clientes':", error));

const app = express();  
const port = 8080;

app.use(cors());
// Middleware de logger
//app.use(verifyToken); // Usa el middleware de logger

// Middleware para interpretar el cuerpo de las solicitudes
app.use(express.json()); // Para interpretar JSON en las solicitudes
app.use(express.urlencoded({ extended: true })); // Para interpretar datos URL-encoded

//app.use(verifyToken);

// Usa las rutas de clientes
app.use("/clientes", clientesRoutes);

// Configura la carpeta 'client' como el directorio de archivos estáticos
app.use(express.static(path.join(__dirname, "..", 'client')));


// Definidas rutas html



app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, "..", 'client', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "register.html"))
});

app.listen(port, () => {
    console.log(`El servidor está corriendo en el puerto ${port}`);
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
            back_urls: {
                success: "https://campus.frsr.utn.edu.ar/moodle/mod/quiz/view.php?id=47895",
                failure: "https://campus.frsr.utn.edu.ar/moodle/mod/quiz/view.php?id=47895",
                pending: "https://campus.frsr.utn.edu.ar/moodle/mod/quiz/view.php?id=47895",
            },
            auto_return: "approved",
        };
        const preference = new Preference(client);
        const result = await preference.create({ body });
        res.json({
            id: result.id,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json ({
            error: "Error al crear la preferencia"
        });
    }
});
app.post('/verify-token', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Obtener el token del encabezado
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