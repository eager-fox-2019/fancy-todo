const Task = require('../models/modelTask')
const { decodeToken } = require('../helpers/jwtHelper')

class ControllerTask {
  static create(req, res, next) {
    console.log('req body recieved', req.body);
    let payload = decodeToken(req.headers.token)
    let newTask = {
      title: req.body.title,
      note: req.body.note,
      is_done: req.body.is_done || false,
      is_starred: req.body.is_starred || false,
      is_late: req.body.is_late || false,
      user_id: payload.userId,
      due_date: (req.body.due_date) ? new Date(req.body.due_date) : ''
    }
    Task.create(newTask)
      .then((createdTask) => {
        console.log('send created', createdTask);
        res.json(createdTask)
      })
      .catch(next)
  }

  static read(req, res, next) {
    console.log('headers token', req.headers.token);
    let payload = decodeToken(req.headers.token)    
    
    Task.find({ user_id: payload.userId })
      .then((tasks) => {
        console.log('send tasks', tasks);
        res.status(200).json(tasks)
      })
      .catch(next)
  }

  static readOne(req, res, next) {
    Task.findById(req.params.taskId)
      .then((task) => {
        res.json(task)
      })
      .catch(next)
  }
  
  static update(req, res, next) {
    console.log('masuk update');
    let updatedTask
    Task.findOne({_id: req.params.taskId})
      .then((task) => {
        console.log('hasil search', task);
        console.log('ini req.body', req.body);
        
        if (!task) throw { code: 404 }
        else {
          let schemaField = Object.keys(Task.prototype.schema.paths)
          let filteredField = Object.keys(req.body).filter((x) => schemaField.indexOf(x) > -1)
          updatedTask = filteredField.reduce((acc, el) => Object.assign(acc, {[el]: req.body[el]}), {})
          console.log('ini updated task', updatedTask);
          return Task.updateOne({ _id: task._id }, updatedTask)
        } 
      })
      .then((task) => {
        console.log('hasil update', task);
        res.send(201)
      })
      .catch(next)
      
  }
  
  static delete(req, res, next) {
    let taskId = req.params.taskId
    Task.findOne({_id: taskId})
      .then((task) => {
        if (!task) throw { code: 404 }
        else {
          return Task.deleteOne({ _id: taskId})
        } 
      })
      .then((data) => {
        res.send(201)
      })
      .catch(next)
  }

  static checkDone(req, res, next) {
    let taskId = req.params.taskId
    console.log('ini headers di checkdone', req.headers);
    
    Task.findOne({_id: taskId})
      .then((task) => {
        if (!task) throw { code: 404 }
        else {
          if (req.method == 'PUT') {
            task.is_done = true
            return task.save()
          } else if (req.method == 'DELETE') {
            task.is_done = false
            return task.save()
          }
        } 
      })
      .then((data) => {
        res.status(201).json(data)
      })
      .catch(next)
  }
  
}

module.exports = ControllerTask