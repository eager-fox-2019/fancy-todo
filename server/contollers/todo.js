const Todo= require('../models/todo')
const countDay= require('../helpers/countDay')

class todoController{

    static create(req, res, next){
        let newTodo= new Todo({
            userId: req.body.userId,
            name: req.body.title,
            description: req.body.description,
            status:'pending',
            dueDate: req.body.dueDate,
            type:req.body.type,
            endDate:null
        })

        newTodo.save()
        .then(todo =>{
            res.status(201).json({todo})
        })
        .catch(next)
    }

    static update(req, res, next){
        Todo.findByIdAndUpdate(req.params.id, {status:req.params.status})
        .then(() =>{
            Todo.findById(req.params.id)
            .then(todo =>{
            res.status(200).json({todo})

            })
            .catch(next)
        })
        .catch(next)
    }

    static updateComplete(req, res, next){
        console.log(req.params.id)
        Todo.findByIdAndUpdate(req.params.id, {status:'Done', endDate: new Date()})
        .then(() =>{
            Todo.findById(req.params.id)
            .then(todo =>{
            res.status(200).json({todo})

            })
            .catch(next)
        })
        .catch(next)
    }

    static delete(req, res, next){
        console.log('masuk delete')
        Todo.findById(req.params.id)
        .then(todo=>{
            if(todo){
                Todo.deleteOne({_id: todo._id})
                .then(() =>{
                    res.status(200).json({todo})
                })
                .catch(next)

            }else{
                res.status(404).message('Task Not Found')
            }
        })
        .catch(next)
    }

    static getAll(req, res, next){
        Todo.find({userId: req.decode.id})
        .then(data =>{
            let todos= data.sort(function(a,b){return new Date(a.dueDate) - new Date(b.dueDate);})
            res.status(200). json({ todos })
        })
        .catch(next)
    }

    static getDeadline(req, res, next){
        console.log('masuk get deadline')
        Todo.find({userId: req.decode.id})
        .then(todos =>{
            console.log(todos)
            let data=[]
            todos.forEach(todo => {
                
                let day= countDay(new Date, todo.dueDate)
                console.log(todo)
                console.log('count day',day)
                if(day == 1 && todo.endDate == null){
                    data.push(todo)
                }
            });
            res.status(200). json({ data })
        })
        .catch(next)
    }

    static getOne(req, res, next){
        Todo.findById({_id: req.params.id})
        .then(todo =>{
            res.status(200).json({ todo })
        })
        .catch(next)
    }

    static getWithStatus(req, res, next){
        Todo.find({status: req.params.status, userId: req.decode.id})
        .then(data =>{
            let todos= data.sort(function(a,b){return new Date(a.dueDate) - new Date(b.dueDate);})
            res.status(200).json({ todos })
        })
        .catch(next)
    }
}

module.exports= todoController