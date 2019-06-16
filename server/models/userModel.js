const mongoose = require('mongoose')
const { hash } = require('../helpers/bcryptjs')

let userSchema = new mongoose.Schema({
    name : {
        type : String,
        required :[true,'Name field can not be empty']
    },
    userName : {
        type : String,
        required : [true, 'Username can not be empty']
    },
    email : {
        type : String,
        required : [true, 'Email field can not be empty'],
        validate : [{
            validator : function (value) {
                if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/) {
                    throw `Invalid format email. `
                }
            },
            validator : function(value) {
                return new Promise (function(resolve, reject){
                        user.findOne({
                            email : value
                        })
                        .then (result=> {
                            if (result) {
                                resolve(false)
                            } else {
                                resolve(true)
                            }
                        })
                        .catch (err=> {
                            console.log (err)
                        })
                })
            },
            message :'Email has been Used. '
            }]
    },
    password : {
        type : String,
        required : [true, 'Password field can not be empty']
    }
})

userSchema.pre('save', function(next) {
    this.password = hash(this.password)
    next()
})

let user = mongoose.model('User', userSchema)


module.exports = user