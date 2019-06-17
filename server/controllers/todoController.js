const TodoModel = require('../models/todo')
const ObjectId = require('mongoose').Types.ObjectId
const axios = require('axios')

let filterFunction = (body) => {
  console.log(body);
  let output = {}
  for (let key in body) {
    if (key === 'name' || key === 'description' || key === 'dueDate' || key === 'status') {
      output[key] = body[key]
    }
  }
  return output
}

class TodoController {

  static showYoutube(req, res) {
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=Tips ${req.query.title}&key=${process.env.YOUTUBE_API}`)
    .then(function ({ data }) {
        let dataYoutube = {
          url: data.items[0].id.videoId,
          title: data.items[0].snippet.title,
          channelTitle: data.items[0].snippet.channelTitle
        }
        res.status(200).json(dataYoutube)
      })
      .catch(function (error) {
        res.status(500).json(error.message)
      });
  }

  static readAll(req, res) {
    TodoModel.find({ userId: req.user._id })
      .then(todo => {
        todo = todo.reverse()
        res.status(200).json(todo)
      })
      .catch(error => {
        res.status(500).json(error)
      })
  }

  static findTodoByUser(req, res) {
    TodoModel.find({ user_id: req.user.id })
      .then(function (todos) {
        res.status(200).json(todos)
      })
      .catch(function (err) {
        res.status(500).json(err)
      })
  }

  static readOne(req, res) {
    TodoModel.findById(req.params.id)
      .then(function (todo) {
        res.status(200).json({ todo })
      })
      .catch(function (err) {
        res.status(500).json({ err: 'internal server error' })
      })
  }

  static create(req, res) {
    const { name, description , dueDate} = req.body
    TodoModel.create({
      name: name,
      userId: req.user._id,
      description: description,
      dueDate : dueDate
    })
      .then(todo => {
        res.status(201).json(todo)
      })
      .catch(err=>{
        res.status(500).json(err)
      })
  }

  static update(req, res) {
    let update = filterFunction(req.body)

    TodoModel
      .findOneAndUpdate(
        { _id: req.params.id },
        update,
        { new: true })
      .then(function (updatedTodo) {
        res.status(201).json({ data: updatedTodo })
      })
      .catch(function (err) {
        res.status(500).json({ err })
      })

  }

  static delete(req, res) {
    TodoModel.findByIdAndDelete({ _id: req.params.id })
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(error => {
        res.status(500).json(error)
      })

  }

}

module.exports = TodoController