const url = 'process.php'

const imgUploaderform = document.querySelector('.uploadImageForm:visible')
console.log(imgUploaderform)

imgUploaderform.addEventListener('submit', e => {
  e.preventDefault()
  console.log("selected one!")

  const files = document.querySelector('[type=file]').files
  const formData = new FormData()

  for (let i = 0; i < files.length; i++) {
    let file = files[i]

    formData.append('files[]', file)
  }

  // fetch(url, {
  //   method: 'POST',
  //   body: formData,
  // }).then(response => {
  //   console.log(response)
  // }).fail(err => {
  //   console.log("error at uploadImageForm", err)
  // })
})
