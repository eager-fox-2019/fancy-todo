const Todo = require('../models/todo')

module.exports = (req, res, next) => {
  Todo.findById(req.params.id)
    .then(row => {
      if (row) {
        if (row.user.equals(req.decoded.id)) {
          next()
        }
        else {
          next({ code: 401, message: 'Unauthorized' })
        }
      }
      else
        next({ code: 404, message: 'Todo not found' })
    })
    .catch(next)
}