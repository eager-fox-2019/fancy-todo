function showError(err, submsg) {
  console.log('masuk sini');
  
  let message = (err.responseJSON) ? err.responseJSON.message : err
  submsg = (submsg) ? submsg : ''
  console.log('masuk sini', message);
  console.log('masuk sini', submsg);

  Swal.fire(
    `${message}`,
    `${submsg}`,
    'error'
  )
}

function showSuccess(msg, submsg) {
  submsg = (submsg) ? submsg : ''
  Swal.fire(
    `${msg}`,
    `${submsg}`,
    'success'
  )
}