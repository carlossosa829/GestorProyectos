import {LoadingBar} from './LoadingBar.js'

function calificar(e) {
    e.preventDefault()
    LoadingBar.show()

    const id_proyecto = document.getElementById('id_proyecto').value
    const observaciones = e.target.querySelector('[name="observaciones"]').value
    const calificacion = e.target.querySelector('[name="calificacion"]').value

    const formData = new FormData();
    formData.append("observaciones",observaciones)
        formData.append("calificacion",calificacion)

        const url = e.target.action
        
        fetch(url,{
            method:'POST',
            body: formData
        })
        .then(res => {
            if(res.status === 201)
                return {status: 201}    
            return res.json()
        })
        .then(res => {
            LoadingBar.close()

            if(res.status === 201){
                Swal.fire({
                    title: 'Entregable calificado',
                    icon: 'success'
                }).then(() => {
                    window.location.href=`/profesor/asignacion/${id_proyecto}`
                })  
        }
    })
    .catch(err => {
        LoadingBar.close()
        console.error(err)
    });
}

document.querySelector('form').addEventListener('submit',e => calificar(e))