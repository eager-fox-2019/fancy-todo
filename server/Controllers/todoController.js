let Todo = require('../Models/todoModel')

class todoController{
    static create(req, res, next){
        console.log('cerating todo')
        console.log(req.decode, 'ini apa?')
        // let {userId} = req.decode.id
        let {title, description, status, dueDate} = req.body
        let obj = new Todo({userId : req.decode.id, title, description, status, dueDate})
        console.log(obj, 'ini obj')
        Todo.create(obj)
        .then(created => {
            console.log(created)
            res.status(200).json(created)
        })
        .catch(next)
    }
    
    static findAll(req, res, next){
        Todo.find({
            userId : req.decode.id
        })
        .then(foundAll => {
            console.log('masuk sampe nemu semua')
            res.status(200).json(foundAll)
        })
        .catch(next)
    }

    static delete(req, res, next){
        console.log(Todo._id)
        console.log('masuk ke delete')
        let msg = 'todo has been deleted'
        Todo.deleteOne({
            _id : req.params.todoId
        })
        .then(deleted => {
            res.status(200).json(msg)
        })
        .catch(next)
    }

    // static put(req, res, next){
    //     let msg = 'todo has been updated'
    //     let updateTodo = { 
    //         title : req.body.title, 
    //         description : req.body.description, 
    //         status : req.body.status, 
    //         dueDate : req.body.dueDate
    //     }

    //     // Todo.updateMany(updateTodo)
    //     // .then(updated => {
    //     //     res.status(200).json(msg)
    //     // })
    //     // .catch(next)
    //     console.log(updateTodo, 'ini updated todo')
    //     Todo.findOneAndUpdate({
    //         _id : req.params.todoId
    //     }, updateTodo)
    //     .then(() => {
    //         console.log('keupdate')
    //         res.status(200).json(msg)
    //     })
    //     .catch(next)
    // }
    static patch(req, res, next){
        let msg = 'updated'
        let updateTodo = {}
        if(req.body.title){
            updateTodo.title = req.body.title
        }
        if(req.body.description){
            updateTodo.description = req.body.description
        }

        if(req.body.status){
            updateTodo.status = req.body.status
        }
        if(req.body.dueDate){
            updateTodo.dueDate = req.body.dueDate
        }
        Todo.findOneAndUpdate({
            _id : req.params.todoId
        }, updateTodo)
        .then(() => {
            res.status(200).json(msg)
        })
        .catch(next)
    }
}




module.exports = todoController