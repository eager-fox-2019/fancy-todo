module.exports = {
  errorHandler(err, req, res, next) {
  if (!err.message) {
    if (err.code == 401) {
      res.status(401).json({
        message: `Unauthorized`
      })
    } else if (err.code == 404) {
      res.status(404).send({
        message: `Data Not Found`
      })
    } else if (err.code == 500) {
      res.status(500).json({
        message: `Internal Server Errors`
      })
    } else {
      console.log(err);
      res.send(err)
    }
  } else {
    // console.log('ini error aneh', err)
    if (err.name === 'MongoError') {
      let message = err.errmsg.split(':')[2].split(' ')[1].split('_')[0]
      res.status(400).json({
        message: `${message} is already in our database. Please use other ${message}`
      })
    } else if (err.name === 'ValidationError') {
      let allMsg = []
      Object.keys(err.errors).forEach((errKey) => {
        allMsg.push(err.errors[errKey].message)
      })
      res.status(400).json({
        message: allMsg.join(', ')
      })
    } else {
      console.log('error apa', err)
      res.status(err.code).json({
        message: err.message
      })
    }
  }
}}