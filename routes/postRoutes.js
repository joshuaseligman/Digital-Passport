const express = require('express');
const router = express.Router();

const { getCurrentUser } = require('../util');
const db = require('../db');

// GET for the page of a specific post
router.get('/:postID', async (req, res) => {
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
router.post('/:postID/delete', async (req, res) => {
    // Remove the post from the database
    await db.deletePost({ _id: req.params.postID });
    // Remove the post from other users' collections
    await db.removeFromSavedPosts(req.params.postID);
    // Redirect to the user
    res.redirect(`/users/${req.session.user}`);
});

// POST for adding a comment
router.post('/:postID/comment', async (req, res) => {
    // Object for the comment with the user's information and comment
    const comment = {
        user: req.body.user,
        commentText: req.body.commentText
    };
    // Add the comment to the database
    await db.addComment(comment, {_id: req.params.postID});
    // Redirect to the post
    res.redirect(`/posts/${req.params.postID}`);
});

// GET for the post selection page
router.get('/', async (req, res) => {
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

module.exports = router;