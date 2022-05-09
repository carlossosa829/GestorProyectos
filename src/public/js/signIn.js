import {API_URL} from './config.js'
import {LoadingBar} from './LoadingBar.js'

function signIn(e) {
    e.preventDefault()

    LoadingBar.show()

    const body = JSON.stringify({
        email: `${e.target.querySelector('[name="email"]').value}`,
        contrasena: `${e.target.querySelector('[name="contrasena"]').value}`
    })
    
    const url = e.target.action

    fetch(url,{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body
    })
    .then(async res => {
        LoadingBar.close()

        return {
            status: res.status,
            ...((res.status != 401) && await res.json())
        }
    })
    .then(res => {
        const {status} = res

        if(status === 200){
            document.cookie = `token=${res.token}`
            
            Swal.fire({
                title: 'Autenticado',
                icon: 'success'
            })
            .then(() => {
                window.location.reload()
            })
        }
        else if(status == 401){
            Swal.fire({
                title: 'Datos erroneos',
                text: 'Usuario / Contraseña incorrectos',
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

document.querySelector('form').addEventListener('submit',e => signIn(e))