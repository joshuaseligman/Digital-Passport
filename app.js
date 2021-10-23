const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const db = require('./db');
const Post = require('./models/postModel');
const User = require('./models/userModel');

const app = express();

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false
}));
app.use(cookieParser());

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

app.get('/', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('index', {account: curAcct});
});

app.get('/map', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('map', {account: curAcct}); 
});

app.post('/map', (req, res) => {
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;

    res.redirect(`/postSelection?city=${city}&state=${state}&country=${country}`.replace(' ', '%20'));
});

app.get('/collection', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('collection', {account: curAcct});
});

app.get('/login', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('login', {account: curAcct});
});

app.post('/signup', async (req, res) => {
    const existingUser = await db.getUsers({username: req.body.username});
    if (existingUser.length === 0) {
        User.create({
            username: req.body.username,
            password: req.body.password
        });
        req.session.user = req.body.username;
    } else {
        req.session.error = 'signup';
    }
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

app.post('/login', async (req, res) => {
    const usersFound = await db.getUsers({username: req.body.username, password: req.body.password});
    if (usersFound.length === 1) {
        req.session.user = req.body.username; 
    } else {
        req.session.error = 'login';
    }
    if (req.session.user) {
        res.redirect('/');
    } else {
        res.redirect('/login');
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
    
    const curAcct = getCurrentUser(req);
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
    req.session.destroy();
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

    const curDate = new Date().toString().split(' ');
    
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
            month: curDate[1],
            day: curDate[2],
            year: curDate[3]
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

function getCurrentUser(req) {
    const curUser = {
        id: (req.session.user) ? 1 : 0,
    };
    if (req.session.error) {
        curUser.id = -1;
        curUser.error = req.session.error;
        req.session.destroy();
    }
    return curUser;
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});