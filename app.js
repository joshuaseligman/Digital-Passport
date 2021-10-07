const express = require('express');
const path = require('path');

const app = express();


app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.port || 3000;

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/map', (req, res) => {
    res.render('map');
});

app.get('/collection', (req, res) => {
    res.render('collection');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/posts', (req, res) => {
    res.render('posts');
});

app.get('/postSelection', (req, res) => {
    res.render('postSelection');
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});