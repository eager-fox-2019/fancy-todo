const Todo = require('../models/todo')
var mongoose = require('mongoose');
const sgMail = require('@sendgrid/mail');

class TodoCont {
  static create (req, res, next) {
    let newTodo = {
      user : req.decoded._id,
      name : req.body.name,
      description: req.body.description,
      statusComplete: false,
      dueDate: req.body.dueDate,
    }
    Todo.create(newTodo)
      .then(todo => {
        res.status(201).json(todo)
      })
      .catch(next)
  }

  static list (req, res, next) {
    Todo.find({user: mongoose.Types.ObjectId(req.decoded._id)}, function (err, todos) {
      if (err) {
        next ({code: 500, message: err.message})
      } else {
        let output = []
        for (let i = 0; i < todos.length; i++){
          let todo = {
            _id: todos[i]._id,
            name : todos[i].name,
            description: todos[i].description,
            statusComplete: todos[i].statusComplete,
            dueDate: todos[i].dueDate,
          }
          output.push(todo)
        }
        res.status(200).json(output)
      }
    })
  }

  static filter (req, res, next) {
    let where = {}
    if (req.params.field === "title") {
      where["name"] = {$regex: req.params.value, $options: 'i'}
    } else {
      where[req.params.field] = req.params.value
    }
    Todo.find(where, function (err, todos) {
      if (err) {
        next ({code: 500, message: err.message})
      } else {
        let output = []
        for (let i = 0; i < todos.length; i++){
          let todo = {
            _id: todos[i]._id,
            name : todos[i].name,
            description: todos[i].description,
            statusComplete: todos[i].statusComplete,
            dueDate: todos[i].dueDate,
          }
          output.push(todo)
        }
        res.status(200).json(output)
      }
    })
  }

  static complete (req, res, next) {
    Todo.findById(req.params.id, (err, todo) => {
      if (err) {
        next({code: 500, message: err.message})
      } else {
        if (todo.statusComplete){
          next ({code: 400, message: `Todo already completed`})
        } else {
          todo.statusComplete = true
          todo.save()
            .then (todo => {
              res.status(200).json(todo)
            })
            .catch(next)
        }
      }
    })
  }

  static delete (req, res, next) {
    Todo.deleteOne({ _id: req.params.id })
    .then(result =>{
      res.status(200).json(result)
    })
    .catch(next)
  }

  static email (req, res, next) {
    Todo.find({user: req.decoded._id, statusComplete: false})
      .then (todos => {
        let today = new Date(new Date().toISOString().substr(0, 10)).getTime()
        let todoRemainder = []
        for (let i in todos){
          let todo = {
            No: todoRemainder.length+1,
            Title: todos[i].name,
            Description: todos[i].description,
            DueDate: ""
          }
          let countdown = (todos[i].dueDate.getTime() - today)/(1000*60*60*24)
          if(countdown <= 5){
            if (countdown >= 2){
              todo.DueDate = `${countdown} more days`
            } else if (countdown === 1) {
              todo.DueDate = `tomorrow`
            } else {
              todo.DueDate = `today`
            }
            todoRemainder.push(todo)
          }
        }
        let notifHTML = `Your Todo List (5 days from today)`
        let notif = `Your Todo List (5 days from today)`
        for (let i in todoRemainder){
          notif += `
No: ${todoRemainder[i].No}
Title: ${todoRemainder[i].Title}
Description: ${todoRemainder[i].Description}
Due Date: ${todoRemainder[i].DueDate}`
          notifHTML += `<br><br>
No: ${todoRemainder[i].No}
<br>
Title: ${todoRemainder[i].Title}
<br>
Description: ${todoRemainder[i].Description}
<br>
Due Date: <strong>${todoRemainder[i].DueDate}</strong>`
        }
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          from: 'felix.laurensius23@gmail.com',
          to: `${req.decoded.email}`,
          subject: 'Notification Todo from Fancy Todo',
          text: notif,
          html: notifHTML
        };
        sgMail.send(msg);
        res.status(200).json({message: `Notification email sent!`})
      })
      .catch(next)
  }
}

module.exports = TodoCont
