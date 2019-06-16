const Todo = require('../models/todo.js')
const Project = require('../models/project.js')

module.exports = {
  todo: (req, res, next) => {
    Todo.findById(req.params.id)
      .exec()
      .then(todo => {
        if(String(todo.owner) === String(req.userData.id)) {
          next()
        } else {
          console.log("AUTH FAILED")
          next({ status: 403, msg: "Unauthorized" })
        }
      })
      .catch(next)
  },
  project: (req, res, next) => {
    Project.findById(req.params.id)
      .exec()
      .then(project => {
        let found = false;
        for(let member of project.members) {
          if(String(member) === String(req.userData.id)) {
            found = true;
            next();
          }
        }
        if(!found) {
          console.log("AUTH FAILED")
          next({ status: 403, msg: "Unauthorized" })
        }
      })
      .catch(next)
  }
}