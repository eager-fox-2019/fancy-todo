const Project = require('../models/project')
const Todo = require('../models/todo')

class TodoCont {
  static create(req, res, next) {
    let exclude = ['_id', '__v', 'createdAt', 'updatedAt']
    let obj = {}
    Todo.schema.eachPath(path => {
      if (path === 'user')
        obj['user'] = req.decoded._id
      else {
        if (!exclude.includes(path)) {
          if (req.body[path])
          obj[path] = req.body[path]
        }
      }
    })

    Todo.create(obj)
      .then(row => {
        if (obj['project']) {
          Project.findByIdAndUpdate(obj['project'], {
            $push: { todo: row._id },
          })
            .then(rowP => {
              res.status(201).json(row)
            })
            .catch(next)}
        else
          res.status(201).json(row)
      })
      .catch(next)
  }

  static read(req, res, next) {
    let obj = {}
    if (req.query._id)
      obj._id = req.query._id
    if (req.query.status)
      obj.status = req.query.status
    if (req.query.title)
      obj.title = { '$regex': req.query.title, '$options': 'i' }
    Todo.find(obj)
      .populate('project')
      .then(rows => {
        res.json(rows)
      })
      .catch(next)
  }

  static readOne(req, res, next) {
    Todo.findById(req.params.id)
      .populate('project')
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }

  static update(req, res, next) {
    let obj = {}
    let exclude = ['_id', '__v', 'createdAt', 'updatedAt']
    if (req.method === "PATCH") {
      Todo.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          if (req.body[path])
            obj[path] = req.body[path]
        }
      })
    }
    else {
      Todo.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          obj[path] = req.body[path]
          // if (req.body['user'])
          //   obj['user'] = req.body['user']
        }
        // else

      })
    }
    console.log(obj)
    Todo.findByIdAndUpdate(req.params.id, obj/* , { new: true } */)
      .then(row => {
        if (!row.project.toString()) {
          Project.findByIdAndUpdate(obj['project'], {
            $push: { todo: row._id },
          })
            .then(rowP => {
              res.json(row)
            })
            .catch(next)
        }
        else if (!row.project.equals(obj['project'])) {
          Promise.all([
            Project.findByIdAndUpdate(obj['project'], {
              $push: { todo: row._id },
            }),
            Project.findByIdAndUpdate(row.project, {
              $pull: { todo: row._id },
            })])
            .then(rows => {
              res.json(row)
            })
            .catch(next)
        }
        else
          res.json(row)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    Todo.findByIdAndDelete(req.params.id)
      .then(row => {
        return Project.findByIdAndUpdate(row.project, {
          $pull: { todo: row.project },
        })
      })
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }
}

module.exports = TodoCont