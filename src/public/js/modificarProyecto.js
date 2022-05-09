import {API_URL} from './config.js'
import {LoadingBar} from './LoadingBar.js'

function getProyectoInfo(id_proyecto){
    return fetch(`${API_URL}proyectos/${id_proyecto}`)
    .then(res => res.json())
    .then(proyecto => proyecto)
    .catch(err => {
        console.error(err)
        return {}
    })
}

async function loadFields(){
    const id_proyecto = document.querySelector('input[name="id_proyecto"]').value
    const proyecto = await getProyectoInfo(id_proyecto)
    
    document.querySelector('input[name="nombre_proyecto"]').value = proyecto.nombre_proyecto
    document.querySelector('input[name="descripcion"]').value = proyecto.descripcion
    document.querySelector('input[name="fecha_inicio"]').value = proyecto.fecha_inicio
    document.querySelector('input[name="fecha_limite"]').value = proyecto.fecha_limite || ''
    document.querySelector('input[name="fecha_fin"]').value = proyecto.fecha_fin || ''
}

function enviarFormulario(e){
    e.preventDefault()

    LoadingBar.show()

    const id_proyecto = document.querySelector('[name="id_proyecto"]').value
    const body = JSON.stringify({
        nombre_proyecto: `${e.target.querySelector('[name="nombre_proyecto"]').value}`,
        descripcion: `${e.target.querySelector('[name="descripcion"]').value}`,
        fecha_inicio: `${e.target.querySelector('[name="fecha_inicio"]').value}`,
        fecha_limite: `${e.target.querySelector('[name="fecha_limite"]').value}`,
        fecha_fin: `${e.target.querySelector('[name="fecha_fin"]').value}`
    })

    fetch(`${API_URL}proyectos/${id_proyecto}`,{
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body
    })
    .then(async res => {
        if(res.status === 200)
            return {status: 200}    
        return {status: res.status, ...await res.json()}
    })
    .then(res => {
        LoadingBar.close()

        if(res.status === 200){
            Swal.fire({
                title: 'Proyecto actualizado',
                icon: 'success'
            })
            .then(() => {
                window.location.href = `/alumno/misProyectos/${id_proyecto}`
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

loadFields()
document.querySelector('form').addEventListener('submit',e => enviarFormulario(e))