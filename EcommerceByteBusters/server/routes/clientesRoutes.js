import express from "express";
import pool from "../db/dbConnections.js";  
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config.js";

const JWT_SECRET = config.jwtSecret;
const router = express.Router();






// Ruta para registrar un cliente
router.post("/register", async (req, res) => {
    const { usuario, password, telefono, email } = req.body;
    try {
        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = `INSERT INTO clientes (usuario, password, telefono, email) VALUES (?, ?, ?, ?)`;
        await pool.execute(query, [usuario, hashedPassword, telefono, email]);
        res.status(201).json({ message: "Cliente registrado con éxito" });
    } catch (error) {
        console.error("Error al registrar cliente:", error);
        res.status(500).json({ error: "Error al registrar cliente" });
    }
});

// Ruta para iniciar sesión
router.post("/login", async (req, res) => {
    const { usuario, password } = req.body;
    try {
        const [rows] = await pool.execute(`SELECT * FROM clientes WHERE usuario = ?`, [usuario]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: user.id, usuario: user.usuario }, JWT_SECRET, { expiresIn: "1h" });
        
        // Incluye el clienteId en la respuesta junto con el token
        res.json({ token, clienteId: user.id });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ error: "Error al iniciar sesión" });
    }
});


// Ruta para registrar los mensajes del formulario de contacto
router.post('/mensaje', async (req, res) => {
    const { nombre, correo, mensaje } = req.body;
    if (!nombre || !correo || !mensaje) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const query = 'INSERT INTO mensajes (nombre, correo, mensaje) VALUES (?, ?, ?)';
        await pool.execute(query, [nombre, correo, mensaje]);
        res.status(200).json({ message: 'Mensaje guardado correctamente.' });
    } catch (error) {
        console.error('Error al guardar el mensaje:', error);
        res.status(500).json({ message: 'Error al guardar el mensaje.' });
    }
});

// Ruta para obtener todos los clientes
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.execute(`SELECT * FROM clientes`);
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        res.status(500).json({ error: "Error al obtener clientes" });
    }
});

// Ruta para obtener un cliente por ID
router.get("/mostrar/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.execute(`SELECT * FROM clientes WHERE id = ?`, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Cliente no encontrado" });
        } else {
            return res.json(rows[0]);
        }
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        return res.status(500).json({ error: "Error al obtener cliente" });
    }
});

// Ruta para actualizar un cliente
router.put("/modificar/:id", async (req, res) => {
    const { id } = req.params;
    const { usuario, password, telefono, email } = req.body;

    try {
        let query = `UPDATE clientes SET usuario = ?, telefono = ?, email = ? WHERE id = ?`;
        const values = [usuario, telefono, email, id];

        if (password) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            query = `UPDATE clientes SET usuario = ?, password = ?, telefono = ?, email = ? WHERE id = ?`;
            values.unshift(hashedPassword);
        }

        const [result] = await pool.execute(query, values);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Cliente no encontrado" });
        } else {
            res.json({ message: "Cliente actualizado con éxito" });
        }
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        res.status(500).json({ error: "Error al actualizar cliente" });
    }
});

// Ruta para eliminar un cliente
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute(`DELETE FROM clientes WHERE id = ?`, [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ error: "Cliente no encontrado" });
        } else {
            res.json({ message: "Cliente eliminado con éxito" });
        }
    } catch (error) {
        console.error("Error al eliminar cliente:", error);
        res.status(500).json({ error: "Error al eliminar cliente" });
    }
});

export default router;
