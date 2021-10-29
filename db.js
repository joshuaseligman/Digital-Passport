const mongoose = require('mongoose');
require('dotenv').config();
const Post = require('./models/postModel');
const User = require('./models/userModel');

mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;

db.on('error', err => {
  console.error('MongoDB error: ' + err.message);
  process.exit(-1);
});

db.once('open', () => {
  console.log('MongoDB connection established');
});

module.exports = {
    getPosts: async (options = {}) => Post.find(options),
    deletePost: async (options = {}) => Post.deleteOne(options),
    addComment: async (comment, options = {}) => Post.updateOne(options, {$addToSet : {comments : comment}}),
    getUsers: async (options = {}) => User.find(options),
    addToSavedPosts: async (postID, options = {}) => User.updateMany(options, {$addToSet : {savedPosts: postID }}),
    removeFromSavedPosts: async (postID, options = {}) => User.updateMany(options, {$pull : {savedPosts: postID }})
};