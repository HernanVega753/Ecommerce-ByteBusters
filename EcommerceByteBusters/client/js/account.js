async function obtenerDatosCuenta() {
    const token = localStorage.getItem("token");  // Obtén el token del localStorage
    console.log("Token:", token);  // Verifica si el token está presente

    if (!token) {
        alert("Por favor, inicia sesión.");
        window.location.href = "login.html";  // Redirige a login si no hay token
        return;
    }

    try {
        const clienteId = 1;  // Reemplaza esto con el clienteId real

        // Realiza la solicitud fetch
        const response = await fetch(`http://localhost:8080/clientes/${clienteId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            try {
                const datos = await response.json();
                console.log("Datos obtenidos:", datos);  // Verifica si los datos son correctos
        
                // Verifica si los datos contienen los campos esperados
                if (datos && datos.nombre && datos.usuario && datos.telefono && datos.email) {
                    // Actualiza los elementos HTML con los datos del usuario
                    document.getElementById("nombre").textContent = datos.nombre || "N/A";
                    document.getElementById("usuario").textContent = datos.usuario || "N/A";
                    document.getElementById("telefono").textContent = datos.telefono || "N/A";
                    document.getElementById("email").textContent = datos.email || "N/A";
                } else {
                    console.error("Datos incompletos:", datos);
                    alert("Los datos del usuario están incompletos.");
                }
            } catch (error) {
                console.error("Error al procesar los datos de la cuenta:", error);
                alert("Hubo un problema al procesar la respuesta del servidor.");
            }
        } else {
            console.error("Error al obtener los datos de la cuenta:", response.statusText, response.status);
            alert(`Hubo un problema al obtener los datos: ${response.statusText} (Código de error: ${response.status})`);
        }
    } catch (error) {
        console.error("Error en la solicitud fetch:", error);
        alert("Hubo un problema al hacer la solicitud de la cuenta.");
    }
}

// Llama a la función al cargar la página
document.addEventListener("DOMContentLoaded", obtenerDatosCuenta);