// Import mongoose
const mongoose = require('mongoose');

// Create the schema for users
const userSchema = mongoose.Schema({
    // Every user has a username
    username: String,
    // Every user has a password
    password: String,
    // Every user has a list of saved posts that consists of Strings of the IDs of the saved posts
    savedPosts: [{type: String, ref: 'Post'}]
});

// Establish the user model for the database and export it for use in other files
const User = mongoose.model('User', userSchema);
module.exports = User;