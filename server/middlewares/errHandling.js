function errHandling(err, req, res, next) {
    if (err.code === 404) {
        res.status(404).json({
            message: 'Not Found!'
        })
    }
    if (err.name === 'ValidationError') {
        res.status(400).json({
            message: err.message
        })
    }
    else {
        let status = err.status || 500
        let messages = err.messages || 'Internal Server Error!'
        res.status(status).json({
            message: messages
        })
    }
}
module.exports = errHandling