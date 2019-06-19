let errHandler = function(err, req, res, next) {
  console.log(err);

  //Validation Error
  if (err.name === 'ValidationError') {
    let key = Object.keys(err.errors)[0]
    res.status(400).json({ message: `Bad Request!: ${err.errors[key].message}` })
  }
  else {
    //Error 4xx/500
    switch (err.code) {
      case 400: res.status(400).json({ message: err.message || `Bad Request` }); break;
      case 401: res.status(401).json({ message: `Unauthorized Access` }); break;
      case 404: res.status(404).json({ message: `Resource Not Found` }); break;
      default: res.status(500).json({ message: `Internal server error` }); break; 
    }
  }
}

module.exports = errHandler