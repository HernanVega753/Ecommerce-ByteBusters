const token = localStorage.getItem("token"); // Obtener el token desde el almacenamiento local
console.log("Token:", token); // Verifica el valor del token
fetch("http://localhost:8080/create_preference", {
    method: "POST", // O el método correspondiente (POST, PUT, etc.)
    headers: {
        "Authorization": `Bearer ${token}`, // Asegúrate de que el token se esté enviando correctamente
    },
})
.then(response => response.json())
.then(data => console.log(data))
.catch (error => console.error("Error:", error)); // Corrección aquí
