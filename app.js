// Import all of the needed Node packages
const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const sharp = require('sharp');

// Import the database stuff
const db = require('./db');
const Post = require('./models/postModel');
const User = require('./models/userModel');

// Initialize the server app
const app = express();

// Set up the cookie data for users
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: false
}));
app.use(cookieParser());

// Set up some other express app settings
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({extended: true}));

// Set up the system for storing the files when uploaded
const storage = multer.diskStorage({
    // Set the upload destination to the uploads 
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    // Fix the file name to remove spaces
    filename: function(req, file, cb) {
        cb(null, file.originalname.replace(/\s/g, '-'));
    }
});
const upload = multer({storage: storage});

// Use port 3000
const PORT = 3000;

// GET for the landing page
app.get('/', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('index', {account: curAcct});
});

// GET for the map page where users select the location
app.get('/map', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('map', {account: curAcct}); 
});

// POST for the map page
app.post('/map', (req, res) => {
    // Get the data from the form
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;

    // Redirect to the post selection page with the query specific data
    res.redirect(`/postSelection?city=${city}&state=${state}&country=${country}`.replace(' ', '%20'));
});

// GET for the collection page
app.get('/collection', (req, res) => {
    // Only can see the page if logged in. If not logged in, redirect to landing page
    if (!req.session.user) {
        res.redirect('/');
    } else {
        let user, savedPosts;
        // Get the user
        db.getUsers({username: req.session.user})
            .then((data) => {
                user = data[0];
                // Get the saved posts for the user
                db.getPosts({ _id: { $in: user.savedPosts } })
                    .then((postsData) => {
                        savedPosts = postsData;
                        const curAcct = getCurrentUser(req);
                        // Show the collection page with the information gathered earlier
                        res.render('collection', {account: curAcct, user: user, posts: savedPosts});
                    });
                });
    }
});

// GET for the login page
app.get('/login', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('login', {account: curAcct});
});

// POST for signing up
app.post('/signup', async (req, res) => {
    // Check to see if the user already exists
    const existingUser = await db.getUsers({username: req.body.signup.username});
    // If the user doesn't already exist
    if (existingUser.length === 0) {
        // Add the new user to the database
        User.create({
            username: req.body.signup.username,
            password: req.body.signup.password,
            savedPosts: []
        });
        // Initialize the cookie for the current user
        req.session.user = req.body.signup.username;
    } else {
        // Set the cookie error to be for the signup form
        req.session.error = 'signup';
    }
    // If the signup was successful
    if (req.session.user) {
        // Go to the user's new profile page
        res.redirect(`/profile/${req.session.user}`);
    } else {
        // Go back to the login page to see the error message
        res.redirect('/login');
    }
});

// POST for logging in
app.post('/login', async (req, res) => {
    // Get the user that the client requested
    const usersFound = await db.getUsers({username: req.body.login.username, password: req.body.login.password});
    // If the user is found
    if (usersFound.length === 1) {
        // Initialize the cookie for the user login session
        req.session.user = req.body.login.username; 
    } else {
        // set the cookie error to be for the login form
        req.session.error = 'login';
    }
    // If the user logged in
    if (req.session.user) {
        // Redirect to the user's profile page
        res.redirect(`/profile/${req.session.user}`);
    } else {
        // Go back to the login page to see the error message
        res.redirect('/login');
    }
});

// GET for the page of a specific post
app.get('/posts/:postID', async (req, res) => {
    // Get the specific post requested in the URL path
    const post = await db.getPosts({ _id: req.params.postID });

    const curAcct = getCurrentUser(req);

    // Set up the context that gets sent back to the EJS file
    const context = {
        account: curAcct,
        post: post[0]
    };

    // If the client is logged in
    if (req.session.user) {
        // Get the client's profile and add it to the EJS context
        const user = await db.getUsers({username: req.session.user});
        context.user = user[0];
    }
    // Render the post page
    res.render('posts', context);
});

// POST for deleting post
app.post('/posts/:postID/delete', async (req, res) => {
    // Remove the post from the database
    await db.deletePost({ _id: req.params.postID });
    // Remove the post from other users' collections
    await db.removeFromSavedPosts(req.params.postID);
    // Redirect to the user
    res.redirect(`/profile/${req.session.user}`);
});

// POST for adding a comment
app.post('/posts/:postID/comment', async (req, res) => {
    // Object for the comment with the user's information and comment
    const comment = {
        user: req.body.user,
        commentText: req.body.commentText
    };
    // Add the comment to the database
    await db.addComment(comment, {_id: req.params.postID});
    // Redirect to the post
    res.redirect(`/posts/${req.params.postID}`);
})

// GET for the post selection page
app.get('/postSelection', async (req, res) => {
    // Get the posts for the inputted location
    const posts = await db.getPosts(
        {
            location: {
                city: req.query.city,
                state: req.query.state,
                country: req.query.country
            }
        }
    );
    
    // Render the post selection page with the appropriate posts
    const curAcct = getCurrentUser(req);
    res.render('postSelection', {account: curAcct, posts: posts});
});

// GET for the profile page
app.get('/profile/:username', async (req, res) => {
    // Get the user requested in the URL
    const reqUser = await db.getUsers({username: req.params.username});
    // If the user doesn't exist, go back to the home page
    if (!reqUser[0]) {
        res.redirect('/');
    }
    // Get the posts of the user
    const posts = await db.getPosts({user: req.params.username});

    // Show the profile page for the requested user
    const curAcct = getCurrentUser(req);
    res.render('profile', {account: curAcct, user: reqUser[0], posts: posts});
});

// POST for updating a user's saved posts collection
app.post('/api/users/savedPosts', async (req, res) => {
    // If the user wants to add the post to their collection
    if (req.body.updateType === 'add') {
        // Add the post to the collection
        await db.addToSavedPosts(req.body.postID, {username: req.body.user});
    } else {
        // Otherwise remove the post from the collection
        await db.removeFromSavedPosts(req.body.postID, {username: req.body.user});
    }
    // Redirect to the post page
    res.redirect(`/posts/${req.body.postID}`);
});

// Logout function
app.get('/logout', (req, res) => {
    // End the session and go back to the landing page
    req.session.destroy();
    res.redirect('/');
});

// GET for the add post page
app.get('/addPost', (req, res) => {
    // If the user is logged out, redirect to the landing page
    if (!req.session.user) {
        res.redirect('/');
    } else {
        // Render the add post page
        res.render('addPost');
    }
});

// POST for adding a post
app.post('/addPost', upload.single('pic'), async (req, res) => {
    // Adjusting the path for the resized image
    let newPath = req.file.path.split('.');
    newPath[0] = newPath[0] + 'resize';
    newPath = newPath.join('.');

    // Resize the image
    await sharp(path.join(__dirname, req.file.path)).resize({ width: 720 }).toFile(path.join(__dirname, newPath))
    .then(function(newFileInfo) {
        console.log("Success");
    })
    .catch(function(err) {
        console.log(err);
    });

    // Read the resized image and base64 encode the data
    const img = fs.readFileSync(newPath);
    const encodedImg = img.toString('base64');
    // Create the image object for the database
    const finalImg = {
        imgData: encodedImg,
        contentType: req.file.mimetype
    }

    // Get the current date
    const curDate = new Date().toString().split(' ');
    
    // Create a Post for the database
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

    // Delete the image from storage and memory
    fs.unlink('./' + req.file.path, (err) => {
        if (err) {
            console.error(err);
        }
    });

    // Delete the resized image from storage and memory
    fs.unlink('./' + newPath, (err) => {
        if (err) {
            console.error(err);
        }
    });

    // Redirect to the user's profile page
    res.redirect(`/profile/${req.session.user}`);
});

// Function for getting the current user that is logged in
function getCurrentUser(req) {
    // Create the user object
    const curUser = {
        id: (req.session.user) ? 1 : 0,
    };
    // If there is an error, get the error informaiton and reset the session 
    if (req.session.error) {
        curUser.id = -1;
        curUser.error = req.session.error;
        req.session.destroy();
    } else {
        // Get the logged in user's username
        curUser.username = req.session.user;
    }
    // Return the user data
    return curUser;
}

// Set up the server to listen on the given port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});