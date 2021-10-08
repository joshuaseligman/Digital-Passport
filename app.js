const express = require('express');
const path = require('path');

const app = express();


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

const posts = [
    {id: 1, src: '/res/posts-imgs/post1.jpg', caption: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."', city: 'London', state: 'England', country: 'GBR', username: 'joshseligman', date: {month: 'June', day: 1, year: 2021}},
    {id: 2, src: '/res/posts-imgs/post2.jpg', caption: 'This is a great caption', city: 'Princeton', state: 'New Jersey', country: 'USA', username: 'joshseligman', date: {month: 'May', day: 4, year: 1976}},
    {id: 3, src: '/res/posts-imgs/post3.jpg', caption: 'This is a great caption', city: 'London', state: 'England', country: 'GBR', username: 'joshseligman', date: {month: 'June', day: 1, year: 2021}},
    {id: 4, src: '/res/posts-imgs/post4.jpg', caption: 'This is a great caption', city: 'London', state: 'England', country: 'GBR', username: 'joshseligman', date: {month: 'June', day: 1, year: 2021}},
    {id: 5, src: '/res/posts-imgs/post5.jpg', caption: 'This is a great caption', city: 'London', state: 'England', country: 'GBR', username: 'joshseligman', date: {month: 'June', day: 1, year: 2021}},
    {id: 6, src: '/res/posts-imgs/post6.jpg', caption: 'This is a great caption', city: 'London', state: 'England', country: 'GBR', username: 'joshseligman', date: {month: 'June', day: 1, year: 2021}},
    {id: 7, src: '/res/posts-imgs/post7.jpg', caption: 'This is a great caption', city: 'London', state: 'England', country: 'GBR', username: 'joshseligman', date: {month: 'June', day: 1, year: 2021}},
    {id: 8, src: '/res/posts-imgs/post8.jpg', caption: 'This is a great caption', city: 'London', state: 'England', country: 'GBR', username: 'joshseligman', date: {month: 'June', day: 1, year: 2021}},
    {id: 9, src: '/res/posts-imgs/post9.jpg', caption: 'This is a great caption', city: 'London', state: 'England', country: 'GBR', username: 'joshseligman', date: {month: 'June', day: 1, year: 2021}},
];

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/map', (req, res) => {
    res.render('map');
});

app.get('/collection', (req, res) => {
    res.render('collection');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/posts', (req, res) => {
    res.render('posts');
});

app.get('/postSelection', (req, res) => {
    let curPostIndex = req.query.cur;
    let cPost = getCurPost(curPostIndex);
    res.render('postSelection', {posts : posts, curPost: cPost});
});

function getCurPost(postIndex) {
    const index = posts.findIndex((post) => {
        return post.id === parseInt(postIndex);
    });
    if (index < 0) {
        return {id: -1, error: 'No such post exists'};
    } else {
        return posts[index];
    }
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});