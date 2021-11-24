const express = require('express');
const router = express.Router();

const { getCurrentUser } = require('../util');

// GET for the landing page
router.get('/', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('index', {account: curAcct});
});

router.get('/about', (req, res) => {
    const curAcct = getCurrentUser(req);
    res.render('about', {account: curAcct});
})

module.exports = router;