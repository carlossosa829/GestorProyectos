import {API_URL} from './config.js'
import {LoadingBar} from './LoadingBar.js'

const enviarFormulario = (e) => {
    e.preventDefault()

    LoadingBar.show()

    const id_entregable = `${e.target.querySelector('[name="id_entregable"]').value}`
    const entregable = e.target.querySelector('[name="entregable"]').files[0]

    if(!entregable){
        LoadingBar.close()
        Swal.fire({
            title: 'No ha anexado ningún archivo.',
            icon: 'warning'
        })
    }

    const body = new FormData()
    body.append('entregable',entregable)

    fetch(`${API_URL}entregables/${id_entregable}/entregable`,{
        method: 'POST',
        body
    })
    .then(async res => {
        if(res.status === 201 || res.status === 404)
            return {status: res.status}    
        return {status: res.status, ...await res.json()}
    })
    .then(res => {
        LoadingBar.close()

        if(res.status === 201){
            Swal.fire({
                title: 'Entregable enviado.',
                icon: 'success'
            })
            .then(() => {
                window.location.reload()
            })
        }
        else if(res.status === 404){
            Swal.fire({
                title: 'Entregable no encontrado.',
                text: 'Favor de no manipular el DOM.',
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
        console.error(err)
    })
}

const form = document.querySelector('form')

if(form)
    form.addEventListener('submit', e => enviarFormulario(e))
