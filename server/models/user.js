const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(10)

let Schema = mongoose.Schema
const userSchema = new Schema({
    username: String,
    email:{
        type:String,
        unique:true,
        validate: {
            validator: function(value){
                return /\S+@\S+\.\S+/.test(value)
            },
            message: props => `${props.value} is not a valid email`
        },
        required: [true, `email is required`]  
    },
    password:String
},{timestamps : true})

userSchema.pre('save',function(next){
    this.password = bcrypt.hashSync(this.password,salt)
    next()
})
const User = mongoose.model('User',userSchema)

module.exports = User