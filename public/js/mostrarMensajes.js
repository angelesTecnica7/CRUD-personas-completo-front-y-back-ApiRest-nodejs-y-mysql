const mostrarMensaje = (mensaje) => {
    contenedorMensajes = document.querySelector(".mensajes")
    contenedorMensajes.style.display = 'block';
    contenedorMensajes.innerHTML = mensaje;
    setTimeout(() => {contenedorMensajes.style.display = 'none';}, 2000)
}