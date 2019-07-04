module.exports = function (err, req, res, next) {
    console.log(err)
    if(err.code === 400 || err.code === 401 || err.code === 404){
        res.status(err.code).json({
            message: err.message
        })
    } else if(err.name === 'ValidationError'){
        res.status(400).json({
            message: err.message,
            path: err.path
        })
    } else {
        res.status(500).json({
            message: err
        })
    } 
}