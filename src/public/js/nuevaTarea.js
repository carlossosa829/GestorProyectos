import {API_URL} from './config.js'
import {LoadingBar} from './LoadingBar.js'

const enviarFormulario = (e) => {
    e.preventDefault()

    LoadingBar.show()

    const responsable = Number.parseInt(e.target.querySelector('[name="responsable"]').value)

    const body = JSON.stringify({
        nombre_tarea: `${e.target.querySelector('[name="nombre_tarea"]').value}`,
        fecha_inicio: `${e.target.querySelector('[name="fecha_inicio"]').value}`,
        fecha_limite: `${e.target.querySelector('[name="fecha_limite"]').value}`,
        descripcion: `${e.target.querySelector('[name="descripcion"]').value}`,
        responsable,
        id_tarea
    })

    fetch(`${API_URL}tareas`,{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body
    })
    .then(async res => {
        if(res.status === 201)
            return {status: 201}    
        return {status: res.status, ...await res.json()}
    })
    .then(res => {
        LoadingBar.close()

        if(res.status === 201){
            Swal.fire({
                title: 'Tarea creada',
                icon: 'success'
            })
            .then(() => {
                window.location.href = '/alumno/misTareas'
            })
        }
        else if(res.status === 422){
            Swal.fire({
                title: 'Campos erroneos',
                text: 'Algunos de los campos introducidos no tienen el formato apropiado.',
                icon: 'warning'
            })
        }
        else{
            Swal.fire({
                title: 'Error del servidor',
                text: res.error || res.message,
                icon: 'error'
            })
        }
    })
    .catch(err => {
        LoadingBar.close()
        error.log(err)
    })
}

window.addEventListener('load',main)