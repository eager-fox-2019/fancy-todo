function showError(err) {
    console.log(err.response)
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