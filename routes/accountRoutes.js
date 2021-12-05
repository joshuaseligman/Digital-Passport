const express = require('express');
const router = express.Router();

const db = require('../db');
const User = require('../models/userModel');

const { getCurrentUser } = require('../util');

// GET for the login page
router.get('/login', (req, res) => {
    // If the user is already logged in
    if (req.session.user) {
        // Redirect to their profile page
        return res.redirect(`/users/${req.session.user}`);
    }

    // Show the login page
    const curAcct = getCurrentUser(req);
    res.render('login', {account: curAcct});
});

// POST for signing up
router.post('/signup', async (req, res) => {
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
        res.redirect(`/users/${req.session.user}`);
    } else {
        // Go back to the login page to see the error message
        res.redirect('/login');
    }
});

// POST for logging in
router.post('/login', async (req, res) => {
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
        res.redirect(`/users/${req.session.user}`);
    } else {
        // Go back to the login page to see the error message
        res.redirect('/login');
    }
});

// Logout function
router.get('/logout', (req, res) => {
    // End the session and go back to the landing page
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;