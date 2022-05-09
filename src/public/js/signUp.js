$(document).ready(function(){
    $("#pupil-option").hide();
    $("#teacher-option").hide();
    $("input[name=rol]").click(function(){
        let option = $(this).val();
        if (option === 'ALUMNO'){
            $("#pupil-option").show("slow");
            $("#teacher-option").hide();
        }
        if (option === 'PROFESOR'){
            $("#pupil-option").hide();
            $("#teacher-option").show("slow");          
        }
    });
});

function signUp(e) {
    e.preventDefault()

    const rol = `${e.target.querySelector('[name="rol"]:checked').value}`

    const body = JSON.stringify({
        nombre: `${e.target.querySelector('[name="nombre"]').value}`,
        paterno: `${e.target.querySelector('[name="paterno"]').value}`,
        materno: `${e.target.querySelector('[name="materno"]').value}`,
        sexo: `${e.target.querySelector('[name="sexo"]:checked').value}`,
        email: `${e.target.querySelector('[name="email"]').value}`,
        contrasena: `${e.target.querySelector('[name="contrasena"]').value}`,
        matricula: `${e.target.querySelector('[name="matricula"]').value}`,
        rol,
        ... (rol !== 'PROFESOR' && {id_carrera: `${e.target.querySelector('[name="id_carrera"]').value}`})
    })

    const url = rol === 'ALUMNO' ? `${e.target.action}alumnos` : `${e.target.action}profesores`

    fetch(url,{
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body
    })
    .then(res => {
        if(res.status === 201)
            return {status: 201}    
        return res.json()
    })
    .then(res => {
        if(res.status === 201){
            Swal.fire({
                title: 'Registro éxitoso',
                icon: 'success'
            }).then(() => {
                $(location).attr('href','/');
            })
        }else{
            $("#user-encontrado").html('<div class="alert alert-danger alert-dismissible">'+
            '<button type="button" class="close" data-dismiss="alert">&times;</button>'+
            `<strong></strong>${res.errors[0].messages[0]}</div>`);
        }
    })
    .catch(err => {error.log(err)})
}

document.querySelector('form').addEventListener('submit',e => signUp(e))