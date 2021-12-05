const express = require('express');
const router = express.Router();

const { getCurrentUser } = require('../util');

// GET for the map page where users select the location
router.get('/', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('map', {account: curAcct}); 
});

// POST for the map page
router.post('/', (req, res) => {
    // Get the data from the form
    const city = req.body.city;
    const state = req.body.state;
    const country = req.body.country;
    const filter = req.body.filter;

    // Redirect to the post selection page with the query specific data
    res.redirect(`/posts?city=${city}&state=${state}&country=${country}&filter=${filter}`.replace(' ', '%20'));
});

module.exports = router;