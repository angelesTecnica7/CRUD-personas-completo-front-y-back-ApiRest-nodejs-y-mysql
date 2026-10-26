//Modulo para guardar imagen en imgBB
const subirImg = async (formData) => {
    const apiKey = '1c1ff0a95bdbfdfde7bb31bbd260d7f3'; // Poné acá tu API Key de ImgBB
    console.log('Subiendo imagen, por favor espera...')

    try {
        // realizamos la petición POST a la API de ImgBB
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        // console.log(data)

        // Procesamos la respuesta del servidor
        if (data.success) {
            const imageUrl = data.data.url; // URL de la imagen subida
            console.log('¡Imagen subida con éxito!')
            return imageUrl
        } else {
            console.log('Error de imagen')
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        mostrarMensaje('Ocurrió un error al conectar con el servidor.')

    }

}


//funcion agregarPersona
const agregarPersona = async (nuevaPersona) => {
    try {
        const res = await fetch('/personas', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            // Send your data in the request body as JSON
            body: JSON.stringify(nuevaPersona)
        })
        if (res.ok) {
            mostrarMensaje('Nueva persona Agregada')
        }

    } catch (error) {
        mostrarMensaje('Error al guardar registro')
    }

    // //actualizamos listado de personas
    mostrarPersonas()
}

//funcion Listado de Personas con filtros
const mostrarPersonas = async (arrayPersonasEncontradas) => {

    //inicializamos el contenedor del listado
    contenedorPersonas = document.querySelector('#listadoPersonas')
    contenedorPersonas.innerHTML = " "
    let arrayPersonas = []

    if (!arrayPersonasEncontradas) {
        //si no exite al arrayPersonasEncontradas quiere decir que debemos mostrar todas
        try {
            const res = await fetch('/personas', {
                method: 'GET',
                headers: { 'content-type': 'application/json' },
            })
            if (res.ok) {
                arrayPersonas = await res.json()
            } else {
                mostrarMensaje('No hay registro de personas')
            }
        } catch (error) {
            mostrarMensaje('error')
        }
    } else {
        arrayPersonas = arrayPersonasEncontradas
    }

    arrayPersonas.forEach(p => {
        contenedorPersonas.innerHTML += `
            <div class="persona">  
                <div class="imagen">
                <img src="${p.imagen}">                      
                    </div>     
                    <div class="info">
                        <p>Nombre: ${p.nombre}</p>
                        <p>Edad: ${p.edad}</p>
                        <p>Dni: ${p.dni}</p>
                    </div>
                    <div class="botones">
                        <button class="btn-modificar" onclick="mostrarformModificar('${p.nombre}', ${p.edad},  ${p.dni}, '${p.id}', '${p.imagen}')">Modificar</button>
                        <button class="btn-eliminar" onclick="eliminarPersona(${p.id})">Eliminar</button>
                    </div>
            </div>                    
        `
    })
}

//funcion intermedia para modificar datos, carga datos guardados de una persona en el formulario y lo muestra
const mostrarformModificar = (nombreActual, edadActual, dni, id, imagen) => {

    document.querySelector('#form-modificar').innerHTML = `
    <div class="cerrar"><button class="btn-cerrar-formModif">X</button></div>
                    <h3>Modificar datos</h3>
                      <div class="imagen">
                <img src="${imagen}">                      
                    </div> 
                    <p> Ingresar nuevos datos: nombre, edad, dni, imagen </p>                    
                    <input type="text" name="nombre" value="${nombreActual}" required>
                    <input type="text" name="edad" value="${edadActual}" required>
                    <input type="text" name="dni" value="${dni}">
                    <input type="hidden" name="id" value="${id}">
                    <input type="file" id="imageInput" name="imagen" accept="image/*" />
                    <input type="submit" name="submit" value="Modificar">
    `
    document.querySelector('#form-modificar').style.display = 'block'
    
}

//funcion modificar Datos de una persona
const modificarPersona = async (id, nuevosDatosPersona) => {
    try {
        const res = await fetch(`/personas/${id}`, {
            method: 'PUT',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(nuevosDatosPersona)
        })
        if (res.ok) {
            arrayPersonas = await res.json()
            //mensaje
            mostrarMensaje('Registro Actualizado')
        }
    } catch (error) { mostrarMensaje('ERROR') }

    //actualizamos listado de personas
    mostrarPersonas()

}

//funcion para eliminar una persona segun el DNI
const eliminarPersona = async (id) => {
    if (confirm('Seguro desea eliminar este registro?')) {
        //hacemos la peticion de borrado a la api mockapi
        try {
            const res = await fetch(`/personas/${id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                // registroEiminado = await res.json() 
                // console.log(registroEiminado)  
                mostrarMensaje('Registro Eliminado')
            }

        } catch (error) { mostrarMensaje('ERROR') }

        //actualizamos listado de personas
        mostrarPersonas()
    }
}

//funcion para buscar Personas por nombre o dni
const buscarPersonas = async (nombre, dni) => {

    console.log(nombre, dni)

    //inicializamos el contenedor del listado
    contenedorPersonas = document.querySelector('#listadoPersonas')
    contenedorPersonas.innerHTML = " "                                                  

    try {
        const res = await fetch(`http://localhost:3000/personas/buscar?nombre=${nombre}&dni=${dni}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' },
        })
        if (res.ok) {
            const arrayPersonasEncontradas = await res.json()
            //llamamos al modulo mostrarPersonas
            mostrarPersonas(arrayPersonasEncontradas)
        } else {
            mostrarMensaje('No existen usuarios con esos datos')
        }

    } catch (error) {
        mostrarMensaje('error')
    }

}