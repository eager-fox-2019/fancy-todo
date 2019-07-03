const mongoose = require('mongoose')

const {Schema} = mongoose
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name:String,
    // username: String,
    password: String,
    email: String
})

userSchema.pre('save', function(next) {
    let user = this
    var salt = bcrypt.genSaltSync(8)
    var hash = bcrypt.hashSync(user.password, salt)
    user.password = hash
    next();
});
const User = mongoose.model('User', userSchema)

module.exports = User