const Todo = require('../models/todo')

module.exports = (req, res, next) => {
  Todo.findOne({_id: req.params.id})
    .then(todo => {
      if (todo) {
        if (todo.user.equals(req.decoded._id)) {
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