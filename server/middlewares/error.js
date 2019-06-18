module.exports = (err, req, res, next) => {
  if (err.code) {
    res.status(err.code).json({
      message: err.message
    })
  }
  else if (err.name == 'ValidationError') {
    // let message = []
    // for(let field in err.errors){
    //   message.push(err.errors[field].message)
    // }
    let message = {}
    for(let field in err.errors){
      message[field] = err.errors[field].message
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