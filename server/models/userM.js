const mongoose = require('mongoose')
const { hash } = require('../helpers/bcryptjs')

let userSchema = new mongoose.Schema({
    name : {
        type : String,
        required :[true,' Name is Required. ']
    },
    userName : {
        type : String,
        required : [true, 'Username is required. ']
    },
    email : {
        type : String,
        required : [true, 'Email is required. '],
        validate : [{
            validator : function (value) {
                if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/) {
                    throw `Invalid format email. `
                }
            },
            validator : function(value) {
                return new Promise (function(resolve, reject){
                    // this.model('User',userSchema)
                        user.findOne({
                            // _id : ({$en : this._id}),
                            email : value
                        })

                        .then (result=> {
                            if (result) {
                                resolve(false)
                            }
                            else {
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
        required : [true, 'Password is required. ']
    }
})

userSchema.pre('save',function(next){
    this.password = hash(this.password)
    next()
})

let user = mongoose.model('User', userSchema)


module.exports = user