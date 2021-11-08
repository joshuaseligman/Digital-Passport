const express = require('express');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const db = require('../db');
const Post = require('../models/postModel');

const { getCurrentUser, upload } = require('../util');

// GET for the profile page
router.get('/:username', async (req, res) => {
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
router.post('/:username/savedPosts/:postID/add', async (req, res) => {
    // Add the post to the collection
    await db.addToSavedPosts(req.params.postID, {username: req.params.username});

    // Redirect to the post page
    res.redirect(`/posts/${req.params.postID}`);
});

// POST for updating a user's saved posts collection
router.post('/:username/savedPosts/:postID/remove', async (req, res) => {
    // Temove the post from the collection
    await db.removeFromSavedPosts(req.params.postID, {username: req.params.username});

    // Redirect to the post page
    res.redirect(`/posts/${req.params.postID}`);
});

// GET for the collection page
router.get('/:username/collection', (req, res) => {
    // Only can see the page if logged in. If not logged in, redirect to landing page
    if (!req.session.user) {
        res.redirect('/');
    } else if (req.session.user !== req.params.username) {
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

// GET for the add post page
router.get('/:username/addPost', (req, res) => {
    // If the user is logged out, redirect to the landing page
    if (!req.session.user) {
        res.redirect('/');
    } else if (req.session.user !== req.params.username) {
        res.redirect('/');
    } else {
        // Render the add post page
        const curAcct = getCurrentUser(req);
        res.render('addPost', { account: curAcct });
    }
});

// POST for adding a post
router.post('/:username/addPost', upload.single('pic'), async (req, res) => {
    // Adjusting the path for the resized image
    let newPath = req.file.path.split('.');
    newPath[0] = newPath[0] + '-resize';
    newPath = newPath.join('.');

    // Resize the image
    await sharp(path.join(__dirname, '..', req.file.path)).resize({ width: 720 }).toFile(path.join(__dirname, '..', newPath))
    .then(function(newFileInfo) {
        console.log("Success");
    })
    .catch(function(err) {
        console.log(err);
    });

    // Read the resized image and base64 encode the data
    const img = fs.readFileSync(path.join(__dirname, '..', newPath));
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
    fs.unlink(path.join(__dirname, '..', req.file.path), (err) => {
        if (err) {
            console.error(err);
        }
    });

    // Delete the resized image from storage and memory
    fs.unlink(path.join(__dirname, '..', newPath), (err) => {
        if (err) {
            console.error(err);
        }
    });

    // Redirect to the user's profile page
    res.redirect(`/users/${req.session.user}`);
});


module.exports = router;