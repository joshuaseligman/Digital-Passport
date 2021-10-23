const express = require('express');
const path = require('path');
const url = require('url');
const fs = require('fs');
const multer = require('multer');

const db = require('./db');
const Post = require('./models/postModel')

const app = express();

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({extended: false}));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname.replace(/\s/g, '-'));
    }
});
const upload = multer({storage: storage});

const port = 3000;

const accounts = [
    {id: 1, username: "joshseligman", password: "helloworld"}
]

let curAcct = {id: 0}

app.get('/', (req, res) => {
    res.render('index', {account: curAcct});
});

app.get('/map', (req, res) => {
    res.render('map', {account: curAcct}); 
});

app.post('/map', (req, res) => {
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;

    res.redirect(`/postSelection?city=${city}&state=${state}&country=${country}`.replace(' ', '%20'));
});

app.get('/collection', (req, res) => {
    res.render('collection');
});

app.get('/login', (req, res) => {
    res.render('login', {account: curAcct});
});

app.post('/login', (req, res) => {
    const signup = req.body.signup;
    if (signup === 'true') {
        let uname = req.body.username;
        const index = accounts.findIndex((acct) => {
            return acct.username === uname;
        });
        if (index === -1) {
            curAcct = {id: Math.floor(Math.random() * 10000) + 1,username: uname, password: req.body.password};
            accounts.push(curAcct);
        } else {
            curAcct = {id: -1, error: "signup"};
        }
    } else if (signup === 'false') {
        const index = accounts.findIndex((acct) => {
            return acct.username === req.body.username
            && acct.password === req.body.password;
        });
        if (index === -1) {
            curAcct = {id: -1, error: "login"};
        } else {
            curAcct = accounts[index];
        }
    }

    if (curAcct.id <= 0) {
        res.render('login', {account: curAcct});
    } else {
        res.redirect('/');
    }
});

app.get('/posts', (req, res) => {
    res.render('posts');
});

app.get('/postSelection', async (req, res) => {
    const posts = await db.getPosts(
        {
            location: {
                city: req.query.city,
                state: req.query.state,
                country: req.query.country
            }
        }
    );
    
    const context = {
        account: curAcct,
        posts: posts.map((post) => ({
            id: post.id,
            user: post.user,
            img: post.img,
            caption: post.caption,
            location: post.location,
            date: post.date,
            comments: post.comments
        })),
        curPost: {id: -1, error: 'No post selected'}
    };

    if (req.query.cur) {
        const curPost = await db.getPosts(
            {
                id: parseInt(req.query.cur)
            }
        );
        context.curPost = curPost[0];
    }

    res.render('postSelection', context);
});

app.get('/profile', (req, res) => {
    res.render('profile');
});

app.get('/logout', (req, res) => {
    curAcct = {id: 0};
    res.redirect('/');
});

app.get('/addPost', (req, res) => {
    res.render('addPost');
});

app.post('/addPost', upload.single('pic'), (req, res) => {
    const img = fs.readFileSync(req.file.path);
    const encodedImg = img.toString('base64');
    const finalImg = {
        imgData: encodedImg,
        contentType: req.file.mimetype
    }
    
    Post.create({
        id: Math.floor(Math.random() * 100000),
        user: 'joshseligman',
        img: finalImg,
        caption: req.body.caption,
        location: {
            city: req.body.city,
            state: req.body.state,
            country: req.body.country
        },
        date: {
            month: 'October',
            day: 16,
            year: 2021
        },
        comments: []
    });

    fs.unlink('./' + req.file.path, (err) => {
        if (err) {
            console.error(err);
        }
    });

    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});