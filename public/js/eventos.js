document.addEventListener("DOMContentLoaded", () => {
    //cargamos listado de personas, invocando al modulo de modulos.js
    mostrarPersonas()

    //Mostrar formulario para agregar Persona desde el boton "Agregar Persona"
    const btn_agregar = document.querySelector('#btn-agregar')
    btn_agregar.addEventListener('click', () => {
        document.querySelector('#form-agregar').style.display = 'block'
    })

    //Ocultar formulario "Agregar persona" desde el boton "cerrar" o X
    document.querySelector('.btn-cerrar-formAgregar').addEventListener('click', (event) => {
        event.preventDefault()
        document.querySelector('#form-agregar').style.display = 'none'
    })

    //formulario "AgregarPersona"
    const form_agregar = document.querySelector('#form-agregar')
    //seleccionamos el input que va a contener la imagen
    const fileUpload = form_agregar.imagen
    // console.log(fileUpload)

    form_agregar.addEventListener('submit', async (e) => {
        e.preventDefault()
        console.log(fileUpload.files.length)

        //imgbb
        // Validamos que se haya seleccionado un archivo

        if (fileUpload.files.length === 0) {
            imagenUrl = 'imgUserDefault.png'
        } else {
            //  Preparamos los datos del formulario (formato Multipart Form Data obligatorio para enviar imagenes)
            const formData = new FormData();
            formData.append('image', fileUpload.files[0]);

            // invocamos al modulo subirImg() enviando argumento imagen del formulario y esperamos recibir la url de la imagen en imgBB
            imagenUrl = await subirImg(formData)
        }

        // console.log(imagenUrl)

        //construyo el objeto que agregaremos al array
        const nuevaPersona = {
            nombre: form_agregar.nombre.value,
            edad: form_agregar.edad.value,
            dni: form_agregar.dni.value,
            imagen: imagenUrl
        }

        console.log(nuevaPersona)
        //invoco al modulo y le paso como argumento el objeto"nuevaPersona"
        agregarPersona(nuevaPersona)

        //limpio el formulario
        form_agregar.reset()

        //oculto el formulario
        document.querySelector('#form-agregar').style.display = 'none'

    })


    //Los evento de los botones "eliminar" un registro, "mostrar" y "cerrar" el Formulario Modificar
    //van dentro del modulo mostrarPersonas porque pueden ser varios botones y es necesario individualizarlos
    //para capturar los datos de cada persona (registro)


    //evento "submit" formulario buscar
    const form_buscar = document.querySelector('#form-buscar')
    form_buscar.addEventListener('submit', (e) => {
        //detenemos el envio del formulario
        e.preventDefault()

        //recogemos los datos ingresados en los campos input
        nombreABuscar = form_buscar.nombre.value
        dniABuscar = form_buscar.dni.value

        //invocamos a la funcion "buscarPersonas" en modulos.js
        buscarPersonas(nombreABuscar, dniABuscar)
    })

    //boton limpiar filtros
    document.querySelector('#btn-filtros').onclick = () => {
        mostrarPersonas()
        form_buscar.reset()
    }


    //evento "submit" formulario modificar
    const form_modificar = document.querySelector('#form-modificar')

    form_modificar.addEventListener('submit', async (e) => {
        e.preventDefault()
        const fileUploadM = document.querySelector('#imageInput')

        //imgbb
        // Validamos que se haya seleccionado un archivo
        if (fileUploadM.files.length === 0) {
            imagenUrl = 'imgUserDefault.png'
        } else {

            // Preparamos los datos del formulario (formato Multipart Form Data obligatorio para enviar imagenes)
            const formData = new FormData();
            formData.append('image', fileUploadM.files[0]);

            // invocamos al modulo subirImg() enviando argumento imagen del formulario y esperamos recibir la url de la imagen en imgBB
            imagenUrl = await subirImg(formData)

            console.log(imagenUrl)
        }


        //construyo el objeto que agregaremos al array
        const nuevosDatosPersona = {
            nombre: form_modificar.nombre.value,
            edad: form_modificar.edad.value,
            dni: form_modificar.dni.value,
            imagen: imagenUrl
        }
        const id = form_modificar.id.value

        //invoco al controlador y le paso como argumento el objeto"nuevosDatosPersona"
        modificarPersona(id, nuevosDatosPersona)

        //limpio el formulario
        form_modificar.reset()

        //oculto el formulario
        document.querySelector('#form-modificar').style.display = 'none'


    })
})
