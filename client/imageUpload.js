
// ------------ image upload --------------
function testImg(strInput){
  let [userId, todoId] = strInput.split(',')
  console.log("image upload todoId is:", todoId)

  const files = document.querySelector(`#image${todoId} [type=file]`).files

  console.log(files)
  console.log("that was files")
  if(files.length >0 ){

    for (let i=0; i<files.length; i++){
      getDataUri(imgUrl, function(dataUri) {
      
      })
    }

    //1 or more files submitted
    // const formData = new FormData()

    // for (let i=0; i<files.length; i++){
    //   formData.append('filesToUpload', files[i])
    // }
    // console.log("formData")
    // console.log(formData)
    // console.log(JSON.stringify(formData))

    // fetch(`${baseUrl}/todos/uploadImage`, {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     access_token: localStorage.getItem('access_token')
    //   },
    // }).then(response => {
    //   console.log(response)
    // }).fail(err => {
    //   console.log("error at uploadImageForm", err)
    // })

    $.ajax({
      method: "POST",
      url: `${baseUrl}/todos/uploadImage`,
      headers: {
        access_token: localStorage.getItem('access_token')
      },
      data: formData
    })
    .done(result => {
      console.log("uploaded images to todo", result)
      populateTodo()
    })
    .fail(err => {
      console.log(err)
    })
  }
}

//<input type="submit" value="Upload File" name="submit" />
function appendUploadImageForm(todo){
  let htmlUploadImageForm = 
  `<form id="image${todo._id}" class="uploadImageForm" method="post" enctype="multipart/form-data">
      <input type="file" name="files[]" multiple />
      <a href="#" onclick="testImg('${todo.owner},${todo._id}')">submit</a>
    </form>`

  $(`#editTodoDiv${todo._id}`).append(htmlUploadImageForm)
}