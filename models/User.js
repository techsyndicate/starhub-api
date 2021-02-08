const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    access_token: {
        type: String,
        required: true
    },
    id: {
        type: Number,
        required: true
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;