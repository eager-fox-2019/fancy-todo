let mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        validate: [{
            validator: function (input) {
                var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                return input.match(mailformat)
            },
            message: props => `${props.value} invalid email`
        }, {
            validator: function (input) {
                return mongoose.model('User', userSchema)
                    .findOne({ _id: { $ne: this._id }, email: input })
                    .then(data => { if (data) return false })
            },
            message: 'Email is already registered!'
        
        }]
    },
    password: String,
    avatar : String
},{ timestamps : true});

userSchema.pre('save', function(next){
   let salt = bcrypt.genSaltSync(10);
   var hash = bcrypt.hashSync(this.password, salt);
    this.password = hash
    next()
})

let User = mongoose.model('User', userSchema);

module.exports = User