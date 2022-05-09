import {API_URL} from './config.js'
import {LoadingBar} from './LoadingBar.js'

const confirmarEliminacion = async () => {
    return Swal.fire({
        title: '¿Desea eliminar la notificación?',
        text: "Esta acción no puede ser revertida.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then(result => result.isConfirmed)
}

const eliminarNotificacion = async (id_usuario,id_notificacion) => {
    LoadingBar.show()
    await fetch(`${API_URL}usuarios/${id_usuario}/notificaciones/${id_notificacion}`,{
        method: 'DELETE'
    })
    .then(async res => {
        if(res.status == 200 || res.status == 404)
            return {status: res.status}    
        return {status: res.status, ...await res.json()}
    })
    .then(res => {
        LoadingBar.close()
        switch(res.status){
            case 200:{
                Swal.fire({
                    title: 'Notificación eliminada',
                    icon: 'success'
                })
                break
            }
            case 404:{
                Swal.fire({
                    title: 'Notificacion no encontrada...',
                    text: 'Por favor no interactue con el DOM.',
                    icon: 'warning'
                })
                break
            }
            case 500:{
                Swal.fire({
                    title: 'Error en el servidor',
                    text: res.error || res.message,
                    icon: 'error'
                })
                break
            }
        }
    })
    .catch(err => {
        LoadingBar.close()
        console.error(err)
    })
}

const marcarComoLeida = async (id_usuario,id_notificacion) => {
    LoadingBar.show()
    const body = JSON.stringify({
        leida: true
    })
    const res = await fetch(`${API_URL}usuarios/${id_usuario}/notificaciones/${id_notificacion}`,{
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body
    })
    await new Promise(resolve => setTimeout(resolve,1500))
    LoadingBar.close()
}

const main = () => {
    const id_usuario = document.querySelector('input[name="id_usuario"]').value
    const notificacionesNoLeidas = document.querySelector('#notificacionesNoLeidas').querySelectorAll(':scope > div')
    const notificacionesLeidas = document.querySelector('#notificacionesLeidas').querySelectorAll(':scope > div')

    for(let notificacion of notificacionesNoLeidas){
        const id_notificacion = notificacion.querySelector('input[name="id_notificacion"]').value
        const link = notificacion.querySelector('a')
        const btnEliminar = notificacion.querySelector('button')

        link.addEventListener('click',
            async (e) => {
                e.preventDefault()
                await marcarComoLeida(id_usuario,id_notificacion)
                window.location.href = link.href
            })
        btnEliminar.addEventListener('click',
            async () => {
                if(await confirmarEliminacion()){
                    await eliminarNotificacion(id_usuario,id_notificacion)
                    notificacion.parentElement.removeChild(notificacion)
                }
            })
    }

    for(let notificacion of notificacionesLeidas){
        const id_notificacion = notificacion.querySelector('input[name="id_notificacion"]').value
        const btnEliminar = notificacion.querySelector('button')

        btnEliminar.addEventListener('click',
            async () => {
                if(await confirmarEliminacion()){
                    await eliminarNotificacion(id_usuario,id_notificacion)
                }
            })
    }
}

main()