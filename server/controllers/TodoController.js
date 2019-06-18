const User = require('../models/user')
const Todo = require('../models/todo')
const calculateDate = require('../helpers/calculateDate')
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'lutfii.dev@gmail.com',
           pass: '1412Dev!'
    }
});

class TodoController {
    static findBelongs(req, res) {
        let todosObj = ''

        if(!req.headers.projectid) {
            req.headers.projectid=null
        }

        Todo.find( {projectId: req.headers.projectid} )
        .populate('userId', 'email')
        .then(todos=> {
            todosObj=todos
            return Todo.countDocuments( {$and: [
                {status: false},
                {projectId: req.headers.projectid}
            ]})
        })
        .then(countActive => {
            res.status(200).json({todosObj, countActive})
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static findOne(req, res) {
        Todo.findOne({
            name: req.params.todoName
        })
        .then(todo => {
            todo.deadline = calculateDate.inDays(todo.due_date, new Date() )

            res.status(200).json(todo)
        })  
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static create(req, res) {
        const {projectId, userId, name, description, status, due_date} = req.body
        let todoCreate = ''

        Todo.create( {
            name,
            description,
            status,
            due_date,
            userId,
            projectId
        } )
        .then(todo=> {
            todoCreate = todo
            return User.findOne({id})
        })
        .then(user => {
            const mailOptions = {
                from: 'lutfii.dev@gmail.com',
                to: `${user.email}`,
                subject: '<fancy todo> You create a new todo',
                html: `
                <div>
                    <p>Congratulations!</p>
                    <p>
                        Your todo list: ${todoCreate.name} has been created
                    </p>
                </div>
                `
            };

            transporter.sendMail(mailOptions, function (err, info) {
            if(err) throw err
            });

            res.status(201).json(todoCreate)
        })
        .catch(err => {
            res.status(500).json({msg: err})
        })
    }

    static update(req, res) {
        const id = req.params.id
        let object = {}
        Object.keys(req.body).forEach(el =>{
            object[el] = req.body[el]
        })

        Todo.findOneAndUpdate({_id: id}, object, {new: true})
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static delete(req, res) {
        const id = req.params.id

        Todo.findOneAndDelete({_id: id})
        .then(todo => {
            res.status(200).json(todo)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static search(req, res) {
        let nameREGEX = `^${req.query.name}`
        Todo.
        find( 
            {name: { $regex: `${nameREGEX}`, $options: 'i' } }
        ).
        then(search=>{
            res.status(200).json(search);
        })
        .catch(err=> {
            res.status(500).json({'msg': err})
        })
    }
}

module.exports = TodoController
