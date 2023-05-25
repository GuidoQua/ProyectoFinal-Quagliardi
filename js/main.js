
let productos = [];

// fetch("./data/data.json")
//     .then(response => response.json())
//     .then(data => {
//         productos = data;
//         cargarProductos(productos);
//     })


async function traerProductos() {
    const response = await fetch("./data/data.json");
    const data = await response.json();
    productos = data;
    cargarProductos(productos);
}

traerProductos();


//Carrito vacio

let carrito = [];


//Declaración del título general

const titulos = document.querySelector(".contenedor-titulos");
titulos.innerText = "Todos los Productos";


/**************************************
***************************************

FUNCION CARGAR PRODUCTOS

***************************************
***************************************/

const contenedorProductos = document.querySelector("#contenedor-productos");


function cargarProductos(productos) {

    contenedorProductos.innerHTML = "";

    productos.forEach(producto => {

        const div = document.createElement("div");
        div.innerHTML= `
                    <div class="contenedor-card">
                        <div class="contenedor-card-imagen">
                            <img class="imagen" src="${producto.imagen}" alt="${producto.titulo}">
                        </div>
                        <div class="contenedor-card-informacion">
                            <h3 class="titulo mb-2">${producto.titulo}</h3>
                            <div class="precio mb-2">$${producto.precio}</div>
                            <button type="button" class="btn btn-dark agregar-carrito" data-id="${producto.id}"><i class="bi bi-bag-fill"></i> AGREGAR</button>
                        </div>
                    </div>
                
        `;

        contenedorProductos.append(div);
    });
};

cargarProductos(productos);


/**************************************
***************************************

FUNCION BUSCAR PRODUCTOS

***************************************
***************************************/

const botonBuscar = document.querySelector(".btn__mio");


botonBuscar.addEventListener("click", function(e) {
    e.preventDefault();

    const buscar = document.querySelector("#buscarProducto");
    const productoBuscado = buscar.value.toLowerCase();

    const resultados = productos.filter(function(producto) {
    return (producto.titulo.toLowerCase().includes(productoBuscado) || producto.categoria.nombre.toLowerCase().includes(productoBuscado) || producto.categoria.producto.toLowerCase().includes(productoBuscado));
    });

    if (productoBuscado == "" || productoBuscado ==" ") {
        titulos.innerText = "Todos los Productos";
        cargarProductos(productos);
    } else if (resultados.length > 0) {
        titulos.innerText = "Resultados de la búsqueda"; //Cambio de título
        cargarProductos(resultados); //Reutilizo la función cargarProductos cambiando el parámetro
    } else {
        contenedorProductos.innerHTML = 
                                    `<div class="contenedor__busquedad">
                                        <p class="text-center pt-3">No se encontró "<b>${productoBuscado}</b>"</p>
                                    </div>`;
    }
});


/**************************************
***************************************

    FUNCION AGREGAR AL CARRITO 
        CON LOCAL STORAGE

***************************************
***************************************/

function agregarAlCarrito(e) {

    if (e.target.classList.contains("agregar-carrito")) {
        const productoId = e.target.dataset.id;
        const producto = productos.find((p) => p.id === productoId);

        Toastify({
            className:"tost-agregar-eliminar",
            text: 'Producto agregado',
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #212529, #dcdcdc)",
            },
            offset: {
                x: "0",
                y: "8rem" 
            },
            onClick: function(){}
        }).showToast();

        if (producto) {
        const productoEnCarrito = carrito.find((p) => p.id === productoId);

        if (productoEnCarrito) {
          // Si ya tengo el producto subo la cantidad y sumar el precio
            productoEnCarrito.cantidad++;
            productoEnCarrito.precioTotal = productoEnCarrito.precio * productoEnCarrito.cantidad;
        } else {
          // Si no tengo el producto en el carrito suma cantidad 1 y el precio normal
            producto.cantidad = 1;
            producto.precioTotal = producto.precio;
            carrito.push(producto);
        }

        guardarCarritoLS();
        mostrarCarrito();
        actualizarCantidadCarrito();
        }
    }
}

  // Función para guardar el carrito en el Local Storage
function guardarCarritoLS() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para trae el carrito del Local Storage
function TraerCarritoLS() {
    const carritoJS = localStorage.getItem("carrito");
    return carritoJS ? JSON.parse(carritoJS) : [];
}

// Cargo el carrito desde el Local Storage
carrito = TraerCarritoLS();
mostrarCarrito();
actualizarCantidadCarrito();

contenedorProductos.addEventListener("click", agregarAlCarrito);


/**************************************
***************************************

        MOSTRAR CARRITO 

***************************************
***************************************/

function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("contenedor-carrito");
    const contenedorComprarVaciar = document.getElementById("contenedor-comprar-vaciar");

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
                                    <div class="carrito__vacio">
                                    <p> Su carrito esta vacío </p>
                                    <a href="#id1"><button type="button" class="btn btn-dark btn-lg p-2">Ir a comprar</button></a>
                                    </div>`;
                                    contenedorComprarVaciar.style.display = "none";
    } else {
        contenedorCarrito.innerHTML = "";

        // Creo los productos del carrito
        carrito.forEach((producto) => {
            const mostrarProductos = document.createElement("div");
            mostrarProductos.innerHTML = `
                                    <div class="producto-carrito">
                                    <img class= "imagen-carrito" src="${producto.imagen}" alt="${producto.titulo}">
                                    <h4 class="m-0 p-1">${producto.titulo}</h4>
                                    <p class="m-0 p-1">Precio: $${producto.precio}</p>
                                    <p class="m-0 p-1">Cantidad: ${producto.cantidad}</p>
                                    <p class="m-0 p-1">Subtotal: $${producto.precioTotal}</p>
                                    <button type="button" class="botones__carrito" data-id="${producto.id}"><i class="bi bi-trash3"></i></button>
                                    </div>`;
                                    
          contenedorCarrito.append(mostrarProductos); // Agrego los productos al carrito

            calcularTotal();

            //Eliminar un producto del carrito
            const botonesEliminar = document.querySelectorAll(".botones__carrito");
            botonesEliminar.forEach((btn) => {
            btn.addEventListener("click", eliminarProducto);
            });
        });

        contenedorComprarVaciar.style.display = "flex"; // Mostrar el contenedor

    }
}

/**************************************
***************************************

        VACIAR CARRITO  

***************************************
***************************************/

const contenedorVaciar = document.getElementById("contenedor-vaciar");
contenedorVaciar.innerHTML = `
                        <button type="button" class="btn-vaciar btn btn-dark btn-md p-2">Vaciar Carrito</button>`;

contenedorVaciar.addEventListener("click", vaciarCarrito);

function vaciarCarrito() {

    Swal.fire({
        title: '¿Quieres vaciar el carrito?',
        iconHtml: '<i class="bi bi-trash3"></i>',
        iconColor:"#f20c0c",
        html: 'Se van a borrar todos tus productos',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Borrar',
        confirmButtonColor:"#f20c0c",
        cancelButtonText: 'Cancelar',
        cancelButtonColor:"#000000",
        }).then((result) => {
            if (result.isConfirmed) {
            carrito = []; 
            guardarCarritoLS(); 
            mostrarCarrito(); 
            calcularTotal();
            actualizarCantidadCarrito();
            } 
        });
}

/**************************************
***************************************

        FUNCION TOTAL CARRITO 

***************************************
***************************************/

function calcularTotal() {
    const total = carrito.reduce((accum, producto) => {
        return accum + producto.precio * producto.cantidad;
        }, 0);

        const contenedorTotal = document.getElementById("total-carrito");

        if (total > 0) {
            contenedorTotal.innerHTML = `
            <p class="text-end me-5"><span class="st__total">Total: $${total}</span></p>`;
        } else {
            contenedorTotal.innerHTML = "";
        }
}


/**************************************
***************************************

        FUNCION ELIMINAR

***************************************
***************************************/

function eliminarProducto(e) {

    Toastify({
        className:"tost-agregar-eliminar",
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #f20c0c, #dcdcdc)",
        },
        offset: {
            x: "0",
            y: "8rem" 
        },
        onClick: function(){}
    }).showToast();

    const productoId = e.currentTarget.dataset.id;
    const productoEnCarrito = carrito.find((p) => p.id == productoId);
    if (productoEnCarrito) {
    if (productoEnCarrito.cantidad > 1) {
        productoEnCarrito.cantidad--;
        productoEnCarrito.precioTotal = productoEnCarrito.precio * productoEnCarrito.cantidad;
    } else {
        const index = carrito.indexOf(productoEnCarrito);
        carrito.splice(index, 1);
    }

    guardarCarritoLS();
    mostrarCarrito();
    calcularTotal();
    actualizarCantidadCarrito();
    }
}

/**************************************
***************************************

        FILTRAR POR CATEGORIA

***************************************
***************************************/

const botonesCategorias = document.querySelectorAll(".botones-categorias");

botonesCategorias.forEach(boton =>{
    boton.addEventListener("click", (e) =>{
        const productosCategorias = productos.filter(producto => producto.categoria.nombre === e.currentTarget.id);
        cargarProductos(productosCategorias);
        const titulosCategorias = productos.find(producto => producto.categoria.nombre === e.currentTarget.id);
        titulos.innerText = titulosCategorias.categoria.nombre;
    });
});


//Actualizar numero carrito

function actualizarCantidadCarrito() {
    const numeroCarrito = document.getElementById("numero-carrito");
    let numeroTotalCarrito = 0;

    carrito.forEach((producto) => {
        numeroTotalCarrito += producto.cantidad;
    });

    if (numeroTotalCarrito > 0) {
        numeroCarrito.innerHTML = `<span class="numerito">${numeroTotalCarrito.toString()}</span></div>`;
    } else {
        numeroCarrito.innerHTML = "";
    }
}

/**************************************
***************************************

        COMPRAR CARRITO

***************************************
***************************************/

const contenedorComprar = document.getElementById("contenedor-comprar");
contenedorComprar.innerHTML = `
                        <button type="button" class="btn btn-dark btn-md p-2">Comprar</button>`;

contenedorComprar.addEventListener("click", comprarCarrito);



function comprarCarrito() {
    const modal = document.getElementById("modalFormulario");

    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}


/************************************
        FINALIZAR COMPRA
 ************************************/

const btnFinalizarCompra = document.getElementById("finalizar-compra");

btnFinalizarCompra.addEventListener("click", finalizarCompra);

function finalizarCompra() {

        const nombreInput = document.getElementById("nombre");
        const emailInput = document.getElementById("email");

        if (nombreInput.value == "" || emailInput.value == "") {

            Swal.fire({
                icon: 'error',
                title: 'No se puede realizar esta acción',
                text: 'Por favor complete el formulario!',
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#000000",
            });
            return;
        } else {
            const nombre = nombreInput.value;
            const email = emailInput.value;

            Swal.fire({
                iconHtml: '<i class="bi bi-bag-check"></i>',
                iconColor:"#43c243",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#000000",
                title: 'Compra realizada con éxito',
                html: `<p>Muchas gracias <b>${nombre}</b>! Te enviamos un mail a <b>${email}</b></p>`,
            });

            const modal = document.getElementById("modalFormulario");
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();

            carrito = []; 
            guardarCarritoLS(); 
            mostrarCarrito(); 
            calcularTotal();
            actualizarCantidadCarrito();
        }
    }
