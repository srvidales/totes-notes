const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const noteData = require('./db/db.json');
const app = express();
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(noteData);
});

app.post('/api/notes', (req, res) => {
    const { title, text } = req.body;
    if (title && title !== '' && text && text !== '') {
        const tmpNote = { id: uuidv4(), title, text }
        tmpNote.id = uuidv4();
        noteData.push(tmpNote);
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(noteData, null, 2), (err) => {
            if (err) {
                res.status(500).json({ error: 'Error saving JSON data to file.' });
            } else {
                res.json(tmpNote);
            }
        });
    } else {
        res.status(500).json({ error: 'Error title and text must be provided.' });
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const noteIndex = noteData.findIndex((note) => note.id === req.params.id);
    if (noteIndex >= 0) {
        const tmpNote = noteData[noteIndex];
        noteData.splice(noteIndex, 1);
        fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(noteData, null, 2), (err) => {
            if (err) {
                res.status(500).json({ error: 'Error saving JSON data to file.' });
            } else {
                res.json(tmpNote);
            }
        });
    } else {
        res.status(500).json(({ error: 'Error finding provided ID.' }));
    }
});

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
