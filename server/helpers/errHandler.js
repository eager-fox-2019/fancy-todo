function errorHandler(err,req,res,next){
    if(err.code === 404){
        res.status(404).json({
            message : "Not Found"
        })
    } else if(err.name === 'ValidationError'){
        var errorArr = []
        for (let listErr in err.errors) {
            errorArr.push({
                message : err.errors[listErr].message,
                path : err.errors[listErr].path
            })
        }
        res.status(400).json({
            errorArr
        })
    } else if(err.code === 500) {
        res.status(500).json({
            message : 'Internal Server Error'
        })
    } else {
        res.status(err.code).json({
            message : err.message
        })
    }
}

module.exports = errorHandler