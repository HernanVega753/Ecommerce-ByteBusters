// Obtiene el ID del usuario desde localStorage
const userId = localStorage.getItem("userId");

// Verifica que el ID esté almacenado
if (!userId) {
    console.error("No se encontró un ID de usuario en la memoria local.");
}

// Función para mostrar información del usuario
async function mostrarUsuario() {
    try {
        const response = await fetch(`/mostrar/${userId}`);
        if (!response.ok) {
            throw new Error("Error al obtener el usuario");
        }
        const usuario = await response.json();
        console.log("Datos del usuario:", usuario);
        // Aquí puedes usar los datos para llenar campos en tu interfaz de usuario
    } catch (error) {
        console.error(error.message);
    }
}

// Función para modificar el usuario
async function modificarUsuario(data) {
    try {
        const response = await fetch(`/modificar/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error("Error al actualizar el usuario");
        }
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error(error.message);
    }
}

// Función para eliminar el usuario
async function eliminarUsuario() {
    try {
        const response = await fetch(`/${userId}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error("Error al eliminar el usuario");
        }
        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error(error.message);
    }
}

// Ejemplo de cómo llamar a cada función:
// Muestra el usuario
mostrarUsuario();

// Modifica el usuario (pasando los datos actualizados)
modificarUsuario({
    usuario: "nuevoUsuario",
    password: "nuevaPassword",
    telefono: "123456789",
    email: "nuevoemail@example.com"
});

// Elimina el usuario
eliminarUsuario();
