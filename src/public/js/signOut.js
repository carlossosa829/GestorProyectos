const signOutBtn = document.querySelector('#sign-out')

if(signOutBtn){
    signOutBtn.addEventListener('click',e => {
        document.cookie = 'token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/;'
        window.location.href = '/'
    })
}