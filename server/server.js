const express = require('express');
const path = require('path');

const app = express();

const projectDir = path.dirname(__dirname);

app.use(express.static(path.join(projectDir, 'public')));

const port = process.env.port || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(projectDir, 'pages/index.html'));
});

app.get('/map', (req, res) => {
    res.sendFile(path.join(projectDir, 'pages/map.html'));
});

app.get('/collection', (req, res) => {
    res.sendFile(path.join(projectDir, 'pages/collection.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(projectDir, 'pages/login.html'));
});

app.get('/posts', (req, res) => {
    res.sendFile(path.join(projectDir, 'pages/posts.html'));
});

app.get('/postSelection', (req, res) => {
    res.sendFile(path.join(projectDir, 'pages/postSelection.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});