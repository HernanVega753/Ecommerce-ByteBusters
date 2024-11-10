// Obtiene el ID del usuario desde localStorage
const userId = localStorage.getItem("clienteId");
const botonModificar = document.getElementById("boton-modificar");

// Verifica que el ID esté almacenado
if (!userId) {
    console.error("No se encontró un ID de usuario en la memoria local.");
}

// Función para modificar el usuario
async function modificarUsuario(data) {
    try {
        const response = await fetch(`http://localhost:8080/cliente/modificar/${userId}`, {
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
        alert("Datos modificados con éxito.");
    } catch (error) {
        console.error(error.message);
        alert("Error al modificar los datos.");
    }
}

// Evento para el botón de modificar
botonModificar.addEventListener("click", () => {
    // Obtiene los valores de los campos de entrada
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;

    // Crea el objeto con los datos
    const data = {
        usuario: usuario,
        telefono: telefono,
        email: email
    };

    // Solo agrega el password si se proporcionó
    if (password) {
        data.password = password;
    }

    // Llama a la función para modificar el usuario
    modificarUsuario(data);
});
