const jwt = require('../helpers/jwt')
const Todo = require('../models/Todo')


function authorization(req, res, next){
    let decodeToken = jwt.decode(req.headers.token)
    console.log(decodeToken.id, "id user");
    console.log(req.params.id, "id todo")
    Todo.findById(req.params.id)    
    .then((gotData)=>{
        if(gotData){
            console.log(gotData.UserId ," got id user");
            if(gotData.UserId == decodeToken.id){
                next()
            } else {
                throw {code : 401, message : "Unauthorized"}
            }
        } else {
        }
    })
    .catch(next)
}

module.exports = authorization