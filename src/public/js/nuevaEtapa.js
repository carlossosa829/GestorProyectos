import {API_URL} from './config.js'
import {LoadingBar} from './LoadingBar.js'

const enviarFormulario = (e) => {
    e.preventDefault()

    LoadingBar.show()

    const id_proyecto = `${e.target.querySelector('[name="id_proyecto"]').value}`
    const body = JSON.stringify({
        nombre: `${e.target.querySelector('[name="nombre"]').value}`,
        id_proyecto,
        fecha_inicio: `${e.target.querySelector('[name="fecha_inicio"]').value}`,
    })

    fetch(`${API_URL}proyectos/${id_proyecto}/etapas`,{
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
                title: 'Etapa creada',
                icon: 'success'
            })
            .then(() => {
                window.location.href = `/alumno/misProyectos/${id_proyecto}/etapas`
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

document.querySelector('form').addEventListener('submit',e => enviarFormulario(e))