const Model = require('../models');
module.exports = (req, res, next) => {
  Model.Todo.find({_id: req.params.todoId})
    .then((todo) => {
      if (todo.length != 0) {
        if (todo[0].userEmail == req.decode.email) {
          next();
        } else {
          next({
            code: 401
          });
        }
      } else {
        next({
          code: 404
        });
      }
    })
    .catch((err) => {
      next(err);
    });
}
