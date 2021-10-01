const express = require('express');
const path = require('path');

const app = express();

const projectDir = path.dirname(__dirname);

app.use(express.static(path.join(projectDir, 'public')));

const port = process.env.port || 3000;

app.get('/', (req, res) => {
    res.sendFile(path.join(projectDir, 'pages/index.html'));
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});