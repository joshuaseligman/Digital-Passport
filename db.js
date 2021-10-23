const mongoose = require('mongoose')
require('dotenv').config()
const Post = require('./models/postModel')

mongoose.connect(process.env.DB_URI)
const db = mongoose.connection

db.on('error', err => {
  console.error('MongoDB error: ' + err.message)
  process.exit(-1)
})

db.once('open', () => {
  console.log('MongoDB connection established')
})

module.exports = {
    getPosts: async (options = {}) => Post.find(options)
};