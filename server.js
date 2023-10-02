const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.send('GET /api/notes response.')
});

app.post('/api/notes', (req, res) => {
    const uuid = uuidv4.uuid();
    res.send(`POST /api/notes ${uuid} response`)
});

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
