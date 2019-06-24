const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "email cannot be empty"],
        validate: {
            validator: function (email) {
                return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
            },
            message: data => `${data.value} is not a valid email`
        },
        validate: {
            validator: function () {
                let isUsed = async function checkEmail(v) {
                    let check = await User.findOne({
                        email: v,
                        _id: {
                            $ne: this._id
                        }
                    })
                    if (check) return false
                    else return true
                }
                return isUsed(this.email)
            },
            message: data => `${data.value} is already in use`
        }
    },
    password: String,
    username: String
})

userSchema.pre('save', async function (next) {
    let salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User