import express from "express";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET='logueado';

const router = express.Router();


// Función para obtener conexión a la base de datos
async function getConnection() {
    return mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'admin',
        database: process.env.DB_NAME || 'constructora'
    });
}


// Ruta para registrar un cliente
router.post("/register", async (req, res) => {
    const { usuario, password, telefono, email } = req.body;
    let connection;
    try {
        connection = await getConnection();

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `INSERT INTO clientes (usuario, password, telefono, email) VALUES (?, ?, ?, ?)`;
        await connection.execute(query, [usuario, hashedPassword, telefono, email]);
        res.status(201).json({ message: "Cliente registrado con éxito" });
    } catch (error) {
        console.error("Error al registrar cliente:", error);
        res.status(500).json({ error: "Error al registrar cliente" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(`SELECT * FROM clientes WHERE usuario = ?`, [usuario]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        // Generar el token con una duración limitada (1 hora)
        const token = jwt.sign({ id: user.id, usuario: user.usuario }, JWT_SECRET, { expiresIn: "1h" });
        
        // Enviar el token en la respuesta
        res.json({ token:  token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});


// Ruta para registrar los mensajes del formulario de contacto
router.post('/mensaje', async (req, res) => {
    const { nombre, correo, mensaje } = req.body;

    console.log('Datos recibidos:', { nombre, correo, mensaje });

    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    let connection;
    try {
        connection = await getConnection();
        const query = 'INSERT INTO mensajes (nombre, correo, mensaje) VALUES (?, ?, ?)';
        await connection.execute(query, [nombre, correo, mensaje]);
        res.status(200).json({ message: 'Mensaje guardado correctamente.' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ message: 'Error al guardar el mensaje.' });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

// Ruta para obtener todos los clientes
router.get("/", async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(`SELECT * FROM clientes`);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ error: "Error al obtener clientes" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
    res.json({ message: 'Acceso permitido a los datos protegidos' });
});

// Ruta para obtener un cliente por ID
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await getConnection();
        const [rows] = await connection.execute(`SELECT * FROM clientes WHERE id = ?`, [id]);
        if (rows.length === 0) {
            res.status(404).json({ error: "Cliente no encontrado" });
        } else {
            res.json(rows[0]);
        }
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        res.status(500).json({ error: "Error al obtener cliente" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

// Ruta para actualizar un cliente
router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { usuario, password, telefono, email } = req.body;
    let connection;

    try {
        connection = await getConnection();
        let query = `UPDATE clientes SET usuario = ?, telefono = ?, email = ? WHERE id = ?`;
        const values = [usuario, telefono, email, id];

        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            query = `UPDATE clientes SET usuario = ?, password = ?, telefono = ?, email = ? WHERE id = ?`;
            values.unshift(hashedPassword);
        }

        const [result] = await connection.execute(query, values);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Cliente no encontrado" });
        } else {
            res.json({ message: "Cliente actualizado con éxito" });
        }
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ error: "Error al actualizar cliente" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

// Ruta para eliminar un cliente
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await getConnection();
        const [result] = await connection.execute(`DELETE FROM clientes WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Cliente no encontrado" });
        } else {
            res.json({ message: "Cliente eliminado con éxito" });
        }
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ error: "Error al eliminar cliente" });
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

export default router;
