const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    savedPosts: [{type: String, ref: 'Post'}]
});

const User = mongoose.model('User', userSchema);
module.exports = User;