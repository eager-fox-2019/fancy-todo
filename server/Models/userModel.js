var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)

let userSchema = new Schema({
    email : String,
    password : String
})

userSchema.pre('save', function(next){
    console.log('shit!')
    this.password = bcrypt.hashSync(this.password, salt)
    next()
})

let User = mongoose.model('Users', userSchema)

module.exports = User