// Import the Node packages
const mongoose = require('mongoose');
require('dotenv').config();

// Import the Post and User schemas
const Post = require('./models/postModel');
const User = require('./models/userModel');

// Set up the database connection
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;

// If there is an error, log it and exit the application
db.on('error', err => {
  console.error('MongoDB error: ' + err.message);
  process.exit(-1);
});

// Log a success message on a good connection
db.once('open', () => {
  console.log('MongoDB connection established');
});

// Functions to export to other files
module.exports = {
    // Get the posts with the given information
    getPosts: async (options = {}) => Post.find(options),
    // Delete the post with the given information
    deletePost: async (options = {}) => Post.deleteOne(options),
    // Add a comment to the post provided
    addComment: async (comment, options = {}) => Post.updateOne(options, {$addToSet : {comments : comment}}),
    // Get the users with the given information
    getUsers: async (options = {}) => User.find(options),
    // Add a post to a user's collection
    addToSavedPosts: async (postID, options = {}) => User.updateMany(options, {$addToSet : {savedPosts: postID }}),
    // Remove a post from a user's collection
    removeFromSavedPosts: async (postID, options = {}) => User.updateMany(options, {$pull : {savedPosts: postID }})
};