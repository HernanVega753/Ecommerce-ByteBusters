const btnMenu = document.getElementById('menu');
const nav = document.getElementById('lista-nav')


btnMenu.addEventListener('click', () => {
    if (nav.style.display === 'none' || nav.style.display === '') {
        nav.style.display = 'flex';
    } else {
        nav.style.display = 'none';
    }
});

// Manejar el formulario de modificación
document.getElementById("modificarUsuarioForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem("clienteId");
    if (!userId) {
        alert("ID de usuario no encontrado.");
        return;
    }

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const telefono = document.getElementById("telefono").value;
    const email = document.getElementById("email").value;

    const data = { usuario, telefono, email };
    if (password) data.password = password;

    try {
        const response = await fetch(`https://ecommerce-bytebusters-production.up.railway.app/clientes/modificar/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert("Datos del usuario modificados con éxito.");
        } else {
            const errorData = await response.json();
            alert(`Error al modificar usuario: ${errorData.error}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al modificar usuario.");
    }
});

// Manejar la eliminación de la cuenta
document.getElementById("eliminarCuenta").addEventListener("click", async () => {
    const userId = localStorage.getItem("clienteId");
    if (!userId) {
        alert("ID de usuario no encontrado.");
        return;
    }

    const confirmacion = confirm("¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.");
    if (!confirmacion) return;

    try {
        const response = await fetch(`https://ecommerce-bytebusters-production.up.railway.app/clientes/deleteUser/${userId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Cuenta eliminada con éxito.");
            
            // Eliminar el ID de usuario y el token del almacenamiento local
            localStorage.removeItem("clienteId");
            localStorage.removeItem("token");

            // Redirecciona a la página de registro
            window.location.href = "register.html";
        } else {
            const errorData = await response.json();
            alert(`Error al eliminar la cuenta: ${errorData.error}`);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error al eliminar la cuenta.");
    }
});
