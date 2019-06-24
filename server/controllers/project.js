const Project = require('../models/project')

class ProjectCont {
  static create(req, res, next) {
    let user = [req.decoded._id].concat(req.body['user[]'])
    let obj = { admin: req.decoded._id, user }
    
    Project.schema.eachPath(path => {
      if(path !== 'admin' && path !== 'user') {
        obj[path] = req.body[path]
      }
    })

    Project.create(obj)
      .then(row => {
        res.status(201).json(row)
      })
      .catch(next)
  }

  static read(req, res, next) {
    let obj = { user: req.decoded._id }
    if (req.query.status)
      obj.status = req.query.status
    if(req.query.title)
      obj.title = { '$regex' : req.query.title, '$options' : 'i' }
    Project.find(obj)
      .populate('user')
      .populate('todo')
      .sort({ status: 1 })
      .then(rows => {
        res.json(rows)
      })
      .catch(next)
  }

  static readOne(req, res, next) {
    Project.findOne({ _id: req.params.id, user: req.decoded._id })
      .populate('user')
      .populate('todo')
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }

  static update(req, res, next) {
    let user = [req.decoded._id].concat(req.body['user[]'])
    let obj = { user }
    let exclude = ['user','todo','admin','_id', '__v', 'createdAt', 'updatedAt']
    if (req.method === "PATCH") {
      Project.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          if (req.body[path])
            obj[path] = req.body[path]
        }
      })
    }
    else {
      Project.schema.eachPath(path => {
        if (!exclude.includes(path)) {
          obj[path] = req.body[path]
          // if (req.body['user'])
          //   obj['user'] = req.body['user']
        }
        // else
          
      })
    }
    
    Project.findByIdAndUpdate(req.params.id, obj, { new: true })
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }

  static delete(req, res, next) {
    // console.log(req.params.id) ==> Bikin error "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
    Project.findByIdAndDelete(req.params.id)
      .then(row => {
        res.json(row)
      })
      .catch(next)
  }
}

module.exports = ProjectCont