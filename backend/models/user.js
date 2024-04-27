const mongoose = require('mongoose');
const { use } = require('../routes/user');

let UserSchema = mongoose.Schema({
    name: {
        type: String,
        requred: true
    },
    surname: {
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'role_user'
    },
    avatar: {
        type: String,
        default: 'default.png'
    },
    create_at: {
        type: Date,
        default: Date.now
    }

})

UserSchema.methods.toJSON = function(){
    let users = this;
    let userObject = users.toObject();
    delete userObject.password;
    return userObject;
}
module.exports = mongoose.model('User', UserSchema)