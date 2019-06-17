const { hash } = require('../helpers/password.helper')
const emailValidation = require('../helpers/email.validation.helper')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
const ModelSchema = Schema({
    email: { 
        type: String, 
        unique: true, 
        required: true, 
        dropDups: true,
        validate: {
            validator: function (v) {
                return emailValidation(v);
            },
            message: props => `${props.value} is not a valid email address!`
        } 
    },
    password: { type: String, required: true }
})

ModelSchema.pre('save', function (next) {
    this.password = hash(this.password)
    next()
});

const Model = mongoose.model('Users', ModelSchema)
module.exports = Model