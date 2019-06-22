module.exports = (err, req, res, next) => {
  console.log(err)
  if (err.code && err.code != 500) {
    res.status(err.code).json({
      message: err.message
    })
  }
  else if (err.name == 'ValidationError') {
    let message = ""
    for(let field in err.errors){
      message = err.errors[field].message
    }
    res.status(400).json({
      message
    })
  }
  else {
    res.status(500).json({
      message: 'Internal Server Error'
    })
  }
}