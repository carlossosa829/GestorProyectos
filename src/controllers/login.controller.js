const {API_URL} = require('../config/config')
const fetch = require('node-fetch')

function getCarreras(){
    return fetch(`${API_URL}/carreras`)
    .then(res => res.json())
    .then(carreras => carreras)
    .catch(err => [])
}

async function renderSignUp(req,res){
    const carreras = await getCarreras()
    
    res.render('login/signUp',{
        pageTitle: 'Registro',
        carreras,
        apiUrl: API_URL
    })
}

function renderSignIn(req,res){
    res.render('login/login',{
        pageTitle: 'Inicio de Sesión',
        apiUrl: API_URL
    })
}

async function signedIn(req,res,next){
    const token = req.cookies.token

    if(!token) return renderSignIn(req,res)

    //CHECK IF VALID TOKEN
    return fetch(`${API_URL}authorize`,{
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(async res => {
        if(res.status === 200){
            req.usuario = await res.json()
            return next()
        }
        else
            return renderSignIn(req,res)
    })
    .catch(err => {
        return renderSignIn(req,res)
    })
}

function isAlumno(req,res,next){
    req.usuario.rol === 'ALUMNO' ?
        next() :
        res.redirect('/profesor')
}

function isProfesor(req,res,next){
    req.usuario.rol === 'PROFESOR' ?
        next() :
        res.redirect('/alumno')
}

module.exports = {
    renderSignUp,
    renderSignIn,
    signedIn,
    isAlumno,
    isProfesor
}