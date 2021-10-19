const express = require('express');
const path = require('path');
const url = require('url');

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

const accounts = [
    {id: 1, username: "joshseligman", password: "helloworld"}
]

let curAcct = {id: 0}

app.get('/', (req, res) => {
    res.render('index', {account: curAcct});
});

app.get('/map', (req, res) => {
    const city = req.query.city;
    const state = req.query.state;
    const country = req.query.country;

    if (city !== undefined && country !== undefined) {
        res.redirect(`/postSelection?city=${city}&state=${state}&country=${country}`.replace(' ', '%20'));
    } else {
        res.render('map', {account: curAcct});
    }
});

app.get('/collection', (req, res) => {
    res.render('collection');
});

app.get('/login', (req, res) => {
    const signup = req.query.signup;
    if (signup === 'true') {
        let uname = req.query.username;
        const index = accounts.findIndex((acct) => {
            return acct.username === uname;
        });
        if (index === -1) {
            curAcct = {id: Math.floor(Math.random() * 10000) + 1,username: uname, password: req.query.password};
            accounts.push(curAcct);
        } else {
            curAcct = {id: -1, error: "signup"};
        }
    } else if (signup === 'false') {
        const index = accounts.findIndex((acct) => {
            return acct.username === req.query.username
            && acct.password === req.query.password;
        });
        if (index === -1) {
            curAcct = {id: -1, error: "login"};
        } else {
            curAcct = accounts[index];
        }
    }

    if (curAcct.id === 0) {
        res.render('login', {account: curAcct});
    } else if (curAcct.id === -1) {
        res.render('login', {account: curAcct})
    } else {
        res.redirect('/');
    }
});

app.get('/posts', (req, res) => {
    res.render('posts');
});

app.get('/postSelection', (req, res) => {
    const goodPosts = posts.filter((post) => {
        return post.city === req.query.city && 
        post.state === req.query.state && 
        post.country === req.query.country;
    });

    const curPostIndex = req.query.cur;
    const cPost = getCurPost(curPostIndex, goodPosts);
    res.render('postSelection', {account: curAcct, posts : goodPosts, curPost: cPost});
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/logout', (req, res) => {
    curAcct = {id: 0};
    res.redirect('/');
})

function getCurPost(postIndex, postsToSearch) {
    const index = postsToSearch.findIndex((post) => {
        return post.id === parseInt(postIndex);
    });
    if (index < 0) {
        return {id: -1, error: 'No such post exists'};
    } else {
        return postsToSearch[index];
    }
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});