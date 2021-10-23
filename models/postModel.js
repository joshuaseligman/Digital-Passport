const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    id: Number,
    user: String,
    img: {
        imgData: String,
        contentType: String
    },
    caption: String,
    location: {
        city: String,
        state: String,
        country: String
    },
    date: {
        month: String,
        day: Number,
        year: Number
    },
    comments: [{
        user: String,
        commentText: String
    }]
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;