import {API_URL} from './config.js'
import {LoadingBar} from './LoadingBar.js'

function getEtapaInfo(id_proyecto,id_etapa){
    return fetch(`${API_URL}proyectos/${id_proyecto}/etapas/${id_etapa}`)
    .then(res => res.json())
    .then(etapa => etapa)
    .catch(err => {
        console.error(err)
        return {}
    })
}

async function loadFields(){
    const id_proyecto = document.querySelector('input[name="id_proyecto"]').value
    const id_etapa = document.querySelector('input[name="id_etapa"]').value
    const etapa = await getEtapaInfo(id_proyecto,id_etapa)
    
    document.querySelector('input[name="nombre"]').value = etapa.nombre
    document.querySelector('input[name="fecha_inicio"]').value = etapa.fecha_inicio
    document.querySelector('input[name="fecha_fin"]').value = etapa.fecha_fin || ''
}

const enviarFormulario = (e) => {
    e.preventDefault()

    LoadingBar.show()

    const id_proyecto = `${e.target.querySelector('[name="id_proyecto"]').value}`
    const id_etapa = `${e.target.querySelector('[name="id_etapa"]').value}`

    const body = JSON.stringify({
        nombre: `${e.target.querySelector('[name="nombre"]').value}`,
        fecha_inicio: `${e.target.querySelector('[name="fecha_inicio"]').value}`,
        fecha_fin: `${e.target.querySelector('[name="fecha_fin"]').value}`
    })

    fetch(`${API_URL}proyectos/${id_proyecto}/etapas/${id_etapa}`,{
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
                title: 'Etapa modificada',
                icon: 'success'
            })
            .then(() => {
                window.location.href = `/alumno/misProyectos/${id_proyecto}/etapas/${id_etapa}`
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