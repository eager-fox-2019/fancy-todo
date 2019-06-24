const Todo = require('../models/todo')
const Project = require('../models/project')

const authTodo = (req, res, next) => {
  Todo.findById(req.params.id)
    .then(row => {
      if (row) {
        if (row.user.equals(req.decoded._id))
          next()
        else
          next({ code: 401, message: 'Unauthorized' })
      }
      else
        next({ code: 404, message: 'Todo not found' })
    })
    .catch(next)
}

const authProject = (req, res, next) => {
  Project.findOne({
    _id: req.params.id,
    admin: req.decoded._id
  })
    .then(row => {
      if (row) {
        if (row.admin.equals(req.decoded._id))
          next()
        else
          next({ code: 401, message: 'Admin Only' })
      }
      else
        next({ code: 404, message: 'Project not found' })
    })
    .catch(next)
}
// const authProject = (req, res, next) => {
//   Project.findById(req.params.id)
//   .then(row => {
//     if (row) {
//       let found = false
//       row.user.forEach(objId => {
//         if(objId.equals(req.decoded._id)){
//           found = true
//           next()
//         }
//       })
//       if(!found)
//         next({ code: 401, message: 'Unauthorized' })
//     }
//     else
//       next({ code: 404, message: 'Project not found' })
//     })
//     .catch(next)
// }


module.exports = { authTodo, authProject }