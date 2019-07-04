const mongoose = require('mongoose')
const { hashPassword } = require('../helpers/bcrypt.js')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: String,
    email: {
        type: String,
        required: [ true, 'Email is required!' ],
        validate: [{
            validator: function(input){
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/i.test(input);
            },
            message: props => `Email not valid!`
        }, {
            validator: function(input){
                return User.findOne({email: input})
                    .then(user => {
                        if(user){
                            return false
                        }
                    })
            },
            message: props => `Email has been registered!`
        }]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 6
    }
}, {timestamps: true})

UserSchema.pre('save', function(next){
    this.password = hashPassword(this.password)
    next()
})

const User = mongoose.model('User', UserSchema)
module.exports = User 