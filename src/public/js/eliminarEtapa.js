import {API_URL} from './config.js'
import {LoadingBar} from './LoadingBar.js'

async function eliminarEtapa(id_proyecto,id_etapa){
    if(await confirmarEliminacion()){
        LoadingBar.show()
        fetch(`${API_URL}proyectos/${id_proyecto}/etapas/${id_etapa}`,{
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
                        title: 'Etapa eliminada',
                        icon: 'success'
                    }).then(() => {
                        window.location.href = `/alumno/misProyectos/${id_proyecto}/`
                    })
                    break
                }
                case 404:{
                    Swal.fire({
                        title: 'Proyecto no encontrado...',
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
}

function confirmarEliminacion(){
    return Swal.fire({
        title: '¿Desea eliminar la etapa?',
        text: "Esta acción no puede ser revertida.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
      }).then(result => result.isConfirmed)
}

const id_proyecto = document.querySelector('input[name="id_proyecto"]').value
const id_etapa = document.querySelector('input[name="id_etapa"]').value
document.querySelector('#btnEliminarEtapa').addEventListener('click',e => eliminarEtapa(id_proyecto,id_etapa))