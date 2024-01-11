const {Schema, model} = require('mongoose');

let PostSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
        required: true,
    },
    file: {
        type: String,
    },
    create_at: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Post', PostSchema, 'posts');