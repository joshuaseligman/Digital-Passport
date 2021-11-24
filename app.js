// Import all of the needed Node packages
const express = require('express');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const { getCurrentUser } = require('./util');

// Initialize the server app
const app = express();

// Set up the cookie data for users
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false
}));
app.use(cookieParser());

// Set up some other express app settings
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));

// Use port 3000
const PORT = 3000;

const indexRoutes = require('./routes/indexRoutes');
app.use('/', indexRoutes);

const mapRoutes = require('./routes/mapRoutes');
app.use('/', mapRoutes);

const accountRoutes = require('./routes/accountRoutes');
app.use('/', accountRoutes);

const postRoutes = require('./routes/postRoutes');
app.use('/posts', postRoutes)

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

app.use((req, res) => {
    res.status(404);
    const curUser = getCurrentUser(req);
    res.render('error404', { account: curUser });
});

// Set up the server to listen on the given port
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});