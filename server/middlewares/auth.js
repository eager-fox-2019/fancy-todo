const { verify } = require('../helpers/jwt');
const User = require('../models/user');
const Todo = require('../models/todo')


module.exports = {
  authenticate: function(req, res, next) {
    let token = req.headers.token;
    if (!token) {
      res.status(401).json({ error: 'You must login to access this endpoint' });
    } else {
      let decoded = verify(token);
      User
       .findOne({
         email: decoded.email
       })
       .then(user => {
         if(user) {
           req.loggedUser = user;
           next();
         } else {
           res.status(401).json({ error: 'User is not valid' });
         }
       })
       .catch(next)
    }
  },
  authorizeTodo: function(req, res, next) {
    Todo.findOne({ _id: req.params.id })
    .then(todo => {
        if(todo.userId == req.loggedUser._id) {
          next()
        } else {
          res.status(401).json({ error: 'Unauthorized' })
        }
      })
      .catch(err => { res.status(500).json(err) })
  },
}
