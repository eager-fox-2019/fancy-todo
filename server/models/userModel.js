const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hashPassword } = require('../helpers/bcrypt')

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: {
            validator: (email) => {
                return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email);
                },
            message: 'Invalid format email'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
})
                    
userSchema.path('email').validate(function(email){
    return User.findOne({email})
    .then(found=>{
        if(found) return false
        else return true
    })
}, `Email is already registered`)
                    
userSchema.pre('save', function (next) {
    this.password = hashPassword(this.password)
    next()
})
                    
const User = mongoose.model('User', userSchema)
                    
module.exports = User