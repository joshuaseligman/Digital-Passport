// Import mongoose
const mongoose = require('mongoose');

// Create the schema for posts
const postSchema = mongoose.Schema({
    // Every post has a user
    user: String,
    // Every post has an image
    img: {
        imgData: String,
        contentType: String
    },
    // Every post has a caption
    caption: String,
    // Every post has a location
    location: {
        city: String,
        state: String,
        country: String,
        position: {
            lat: Number,
            lng: Number
        }
    },
    // Every post is uploaded at a certain date
    date: {
        month: String,
        day: String,
        year: String
    },
    // Posts have a list of comments that consist of a user and the comment text
    comments: [{
        user: String,
        commentText: String
    }]
});

// Establish the model for the database and export it for use in other files
const Post = mongoose.model('Post', postSchema);
module.exports = Post;