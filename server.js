const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const noteData = require('./db/db.json');
const app = express();
const PORT = process.env.PORT || 3001;

/**
 * Set up serving static files in public directory.
 */
app.use(express.static('public'));


/**
 * Set up rest of express middleware.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * express GET / route returning index.html.
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * express GET /notes route returning public/notes.html.
 */
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});

/**
 * express GET /api/notes route returning db/db.json file content.
 */
app.get('/api/notes', (req, res) => {
    res.json(noteData);
});

/**
 * express POST /api/notes route returning newly created note.
 */
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

/**
 * express DELETE /api/notes/id route returning deleted note.
 */
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

/**
 * Start listening on desired port.
 */
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);
