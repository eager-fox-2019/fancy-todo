module.exports = function (err, req, res, next) {
    if (err.name === "ValidationError") {
        let errors = Object.keys(err.errors)
        let objErr = {}
        errors.forEach(errorType => {
            objErr[errorType] = err.errors[errorType].message
        })
        res.status(400).json({
            ValidationError: objErr
        })
    } else if (err.name === 'JsonWebTokenError') {
        res.status(400).json({
            [err.name]: err.message
        })
    } else if (err.code === 400) {
        let message = "bad request"
        if (err.message) {
            message = err.message
        }
        res.status(400).json({
            message
        })
    } else if (err.code === 401) {
        let message = "not Authorized"
        if (err.message) {
            message = err.message
        }
        res.status(401).json({
            message
        })
    } else if (err.code === 404) {
        let message = "resource not found"
        if (err.message) {
            message = err.message
        }
        res.status(404).json({
            message
        })
    } else {
        res.status(500).json({
            message: "internal server error"
        })
    }
}