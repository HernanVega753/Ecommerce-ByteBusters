async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:8080/clientes/products');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

function displayProducts(products) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';

        productItem.innerHTML = `
            <span>${product.productName} - $${product.price} - Cantidad: ${product.quanty}</span>
            <button onclick="editProduct(${product.id})">Editar</button>
            <button onclick="deleteProduct(${product.id})">Eliminar</button>
        `;

        productList.appendChild(productItem);
    });
}

async function editProduct(id) {
    const productName = prompt('Nombre del Producto:');
    const price = prompt('Precio:');
    const quanty = prompt('Cantidad:');
    const img = prompt('URL de la Imagen:');

    const updatedProduct = { productName, price, quanty, img };

    try {
        await fetch(`http://localhost:8080/clientes/products/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        });

        fetchProducts();
    } catch (error) {
        console.error('Error al actualizar producto:', error);
    }
}

async function deleteProduct(id) {
    try {
        await fetch(`http://localhost:8080/clientes/delete/${id}`, {
            method: 'DELETE'
        });

        fetchProducts();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
    }
}

document.getElementById('productForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const price = document.getElementById('price').value;
    const quanty = document.getElementById('quanty').value;
    const img = document.getElementById('img').value;

    const newProduct = {
        productName: productName,
        price: price,
        quanty: quanty,
        img: img
    };

    try {
        const response = await fetch('http://localhost:8080/clientes/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (response.ok) {
            alert('Producto añadido con éxito');
            fetchProducts();
        } else {
            alert('Error al añadir producto');
        }
    } catch (error) {
        alert('Error de conexión. Servidor no disponible.');
    }
});

// Fetch and display products when the page loads
fetchProducts();
