//contador de productos dentro del carrito
let contador = Number(localStorage.getItem("carrito")) || 0;
document.getElementById("count").textContent = contador;


//lee los productos
let carrito = JSON.parse(localStorage.getItem("carritoProductos")) || [];


// guarda el carrito para luego mostrarlo
function guardarCarrito() {
    localStorage.setItem("carritoProductos", JSON.stringify(carrito));
}


//suma el contador
function actualizarContador(cantidad) {
    contador += cantidad;
    localStorage.setItem("carrito", contador);
    document.getElementById("count").textContent = contador;
}

//Mensaje agregado al carrito
function mostrarMensaje(texto, tipo = "success") {
    const div = document.getElementById("mensaje-carrito");

    // Colores según tipo
    div.style.backgroundColor = tipo === "success" ? "#d4edda" : "#f8d7da";
    div.style.color = "#155724";
    div.style.border = "1px solid #c3e6cb";
    div.style.borderRadius = "5px";

    div.textContent = texto;
    div.style.display = "block";

    // Ocultar después de 3 segundos
    setTimeout(() => {
        div.style.display = "none";
    }, 2500);
}


//agrega datos de los productos a la página del carrito
document.querySelectorAll(".agregar-carrito").forEach(boton => {
    boton.addEventListener("click", () => {

        const tarjeta = boton.closest(".card-body") || boton.closest(".col-md-6");

        let nombre = tarjeta.querySelector(".nombre-producto").textContent.trim();
        let precioTexto = tarjeta.querySelector(".precio-producto").textContent.trim();
        let cantidad = Number(tarjeta.querySelector(".cantidad").value);

        // Limpia el valor para sumarlo
        let precio = Number(precioTexto.replace("$", "").replace(".", ""));

        // Buscar si el producto ya está en carrito
        let existe = carrito.find(p => p.nombre === nombre);

        if (existe) {
            existe.cantidad += cantidad;
            existe.subtotal = existe.precio * existe.cantidad;
        } else {
            carrito.push({
                nombre,
                precio,
                cantidad,
                subtotal: precio * cantidad
            });
        }

        guardarCarrito();
        actualizarContador(cantidad);

        mostrarMensaje("Producto agregado al carrito");

    });
});



//Muestra lo agregado al carrito
function cargarCarritoEnTabla() {
    let tbody = document.getElementById("carrito-body");
    let totalHTML = document.getElementById("total");

    if (!tbody) return; // Si no está en la página del carrito

    tbody.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {

        let fila = `
            <tr>
                <td>${producto.nombre}</td>
                <td>$${producto.precio.toLocaleString()}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.subtotal.toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-danger eliminar" data-indice="${index}">
                        X
                    </button>
                </td>
            </tr>
        `;

        tbody.innerHTML += fila;
        total += producto.subtotal;
    });

    totalHTML.textContent = "$" + total.toLocaleString();

    // Activar botones eliminar
    document.querySelectorAll(".eliminar").forEach(btn => {
        btn.addEventListener("click", function () {
            let index = this.getAttribute("data-indice");

            // Restar del contador
            actualizarContador(-carrito[index].cantidad);

            // Eliminar producto
            carrito.splice(index, 1);

            guardarCarrito();
            cargarCarritoEnTabla();
        });
    });
}

cargarCarritoEnTabla();


//Limpia todo el carrito
const botonVaciar = document.getElementById("vaciarCarrito");

if (botonVaciar) {
    botonVaciar.addEventListener("click", () => {
        carrito = [];
        guardarCarrito();

        contador = 0;
        localStorage.setItem("carrito", "0");
        document.getElementById("count").textContent = "0";

        cargarCarritoEnTabla();
    });
}


