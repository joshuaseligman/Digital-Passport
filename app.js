const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sharp = require('sharp');

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
app.use(express.static(path.join(__dirname, 'uploads')));

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
    if (!req.session.user) {
        res.redirect('/');
    } else {
        let user, savedPosts;
        db.getUsers({username: req.session.user})
            .then((data) => {
                user = data[0];
                db.getPosts({ _id: { $in: user.savedPosts } })
                    .then((postsData) => {
                        savedPosts = postsData;
                        const curAcct = getCurrentUser(req);
                        res.render('collection', {account: curAcct, user: user, posts: savedPosts});
                    });
                });
    }
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
            password: req.body.password,
            savedPosts: []
        });
        req.session.user = req.body.username;
    } else {
        req.session.error = 'signup';
    }
    if (req.session.user) {
        res.redirect(`/profile/${req.session.user}`);
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
        res.redirect(`/profile/${req.session.user}`);
    } else {
        res.redirect('/login');
    }
});

app.get('/posts/:postID', async (req, res) => {
    const post = await db.getPosts({ _id: req.params.postID });

    const curAcct = getCurrentUser(req);

    const context = {
        account: curAcct,
        post: post[0]
    };

    if (req.session.user) {
        const user = await db.getUsers({username: req.session.user});
        context.user = user[0];
    }
    res.render('posts', context);
});

app.post('/posts/:postID', async (req, res) => {
    await db.deletePost({ _id: req.params.postID });
    await db.removeFromSavedPosts(req.params.postID);
    res.redirect(`/profile/${req.session.user}`);
});

app.post('/posts/:postID/comment', async (req, res) => {
    const comment = {
        user: req.body.user,
        commentText: req.body.commentText
    };
    await db.addComment(comment, {_id: req.params.postID});
    res.redirect(`/posts/${req.params.postID}`);
})

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

    res.render('postSelection', {account: curAcct, posts: posts});
});

app.get('/profile/:username', async (req, res) => {
    const reqUser = await db.getUsers({username: req.params.username});
    if (!reqUser[0]) {
        res.redirect('/');
    }

    const posts = await db.getPosts({user: req.params.username});
    const curAcct = getCurrentUser(req);
    res.render('profile', {account: curAcct, user: reqUser[0], posts: posts});
});

app.post('/api/users/savedPosts', async (req, res) => {
    if (req.body.updateType === 'add') {
        await db.addToSavedPosts(req.body.postID, {username: req.body.user});
    } else {
        await db.removeFromSavedPosts(req.body.postID, {username: req.body.user});
    }
    res.redirect(`/posts/${req.body.postID}`);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/addPost', (req, res) => {
    if (!req.session.user) {
        res.redirect('/');
    } else {
        res.render('addPost');
    }
});

app.post('/addPost', upload.single('pic'), async (req, res) => {
    let newPath = req.file.path.split('.');
    newPath[0] = newPath[0] + '1';
    newPath = newPath.join('.');
    await sharp(path.join(__dirname, req.file.path)).resize({ width: 720 }).toFile(path.join(__dirname, newPath))
    .then(function(newFileInfo) {
        console.log("Success");
    })
    .catch(function(err) {
        console.log(err);
    });

    const img = fs.readFileSync(newPath);
    const encodedImg = img.toString('base64');
    const finalImg = {
        imgData: encodedImg,
        contentType: req.file.mimetype
    }

    const curDate = new Date().toString().split(' ');
    
    await Post.create({
        user: req.session.user,
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

    fs.unlink('./' + newPath, (err) => {
        if (err) {
            console.error(err);
        }
    });

    res.redirect(`/profile/${req.session.user}`);
});

function getCurrentUser(req) {
    const curUser = {
        id: (req.session.user) ? 1 : 0,
    };
    if (req.session.error) {
        curUser.id = -1;
        curUser.error = req.session.error;
        req.session.destroy();
    } else {
        curUser.username = req.session.user;
    }
    return curUser;
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});