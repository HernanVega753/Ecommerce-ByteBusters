// Comprueba si el token está presente y es válido
const token = localStorage.getItem('token');
if (!token) {
    // Si no hay token, redirige a la página de login
    window.location.href = '/login.html'; 
} else {
    // Si hay un token, verifica su validez
    fetch('/verify-token', {
        method: 'POST',
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        if (!data.isValid) {
            // Si el token no es válido, redirige a login
            window.location.href = '/login.html';
        }
    })
    .catch(() => {
        // Si hay un error al verificar el token, redirige a login
        window.location.href = '/login.html';
    });
}
