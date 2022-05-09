export class LoadingBar{
    static show(){
        Swal.fire({
            allowOutsideClick: false,
            width: '12rem',
            didOpen: () => {
                Swal.showLoading()
            }
        })
    }

    static close(){
        Swal.close()
    }
}