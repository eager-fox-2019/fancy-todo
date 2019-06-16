module.exports = function (err, req, res, next) {
    console.log(err);
    if (err.name === 'SequelizeValidationError') {
        const errors = err.errors.map((error) => ({
            message: error.message,
            path: error.path,
        }));
        res.status(400).json({
            errors,
        });
    } else {
        let status = err.status || 500
        let msg = err.msg || 'Internal server error'

        res.status(status).json({
            message: msg,
        });
    }
}