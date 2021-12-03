const express = require('express');
const router = express.Router();

const { getCurrentUser } = require('../util');
const db = require('../db');

// GET for the post selection page
router.get('/', async (req, res) => {
    // Determine the filter
    const filter = req.query.filter;
    const filteredLocation = {
        country: req.query.country
    };
    if (filter !== 'country') {
        filteredLocation.state = req.query.state;

        if (filter !== 'state') {
            filteredLocation.city = req.query.city;
        }
    }

    // Get the posts for the inputted location
    let posts;
    if (filter === 'country') {
        posts = await db.getPosts(
            {
                "location.country": filteredLocation.country
            }
        );
    } else if (filter === 'state') {
        posts = await db.getPosts(
            {
                "location.country": filteredLocation.country,
                "location.state": filteredLocation.state
            }
        );
    } else {
        posts = await db.getPosts(
            {
                "location.country": filteredLocation.country,
                "location.state": filteredLocation.state,
                "location.city": filteredLocation.city
            }
        );
    }

    let place = ''; 
    if (isNotUndefined(filteredLocation.city)) {
        place += filteredLocation.city;
    }
    if (isNotUndefined(filteredLocation.state) && isNotUndefined(filteredLocation.city)) {
        place += ', ';
    }
    if (isNotUndefined(filteredLocation.state)) {
        place += filteredLocation.state;
    }
    if (isNotUndefined(filteredLocation.country) && (isNotUndefined(filteredLocation.city) || isNotUndefined(filteredLocation.state))) {
        place += ', ';
    }
    if (isNotUndefined(filteredLocation.country)) {
        place += filteredLocation.country;
    }
    
    // Render the post selection page with the appropriate posts
    const curAcct = getCurrentUser(req);
    res.render('postSelection', {account: curAcct, posts: posts, location: place});
});

router.get('/cities', async (req, res) => {
    const locations = await db.getPosts({}, {_id: 0, location: 1});
    const locCounts = getTotals(locations);
    res.send(locCounts);
})

// GET for the page of a specific post
router.get('/:postID', async (req, res) => {
    // Get the specific post requested in the URL path
    const post = await db.getPosts({ _id: req.params.postID })
        .catch((err) => {});
    if (post === undefined || post.length !== 1) {
        return res.redirect('/404');
    }
    
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

function isNotUndefined(val) {
    return val !== undefined && val !== 'undefined';
}

function getTotals(locs) {
    const counts = {};
    for (const l of locs) {
        const loc = l.location
        if (counts[loc.country] === undefined) {
            counts[loc.country] = {};
            counts[loc.country][loc.state] = {};
            counts[loc.country][loc.state][loc.city] = 1;
        } else if (counts[loc.country][loc.state] === undefined) {
            counts[loc.country][loc.state] = {};
            counts[loc.country][loc.state][loc.city] = 1;
        } else if (counts[loc.country][loc.state][loc.city] === undefined) {
            counts[loc.country][loc.state][loc.city] = 1;
        } else {
            counts[loc.country][loc.state][loc.city]++;
        }
    }
    return counts;
}

module.exports = router;