function showError(err) {
    if(err.response.status == 400) {
        Swal.fire({
            type: `${err.response.status}`,
            title: `${err.response.statusText}`,
            text: `${err.response.data.message}`,
            footer: '<a href>Why do I have this issue?</a>'
          })
          initial()          
    }else {
        $('body').html(
            `
            <div class="container d-flex flex-column mt-5" style="border:1px solid red;">
            <h1 style="color:yellow">${err.response.statusText}</h1>
            <h1 style="color:red">${err.response.status}</h1>
            <h1 style="color:red">${err.response.data.message}</h1>
            </div>
            `
        )
    }
}