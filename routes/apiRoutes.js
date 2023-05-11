const fs = require('fs');
const path = require('path');
const uniqid = require('uniqid');

module.exports = (app) => {
  // Get all notes
  app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading notes from database');
      }

      const notes = JSON.parse(data);
      res.json(notes);
    });
  });

  // Create a new note
  app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading notes from database');
      }

      const db = JSON.parse(data);

      const newNote = {
        id: uniqid(),
        title: req.body.title,
        text: req.body.text,
      };

      db.push(newNote);

      fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(db), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error writing note to database');
        }

        res.json(newNote);
      });
    });
  });

  // Delete a note by ID
  app.delete('/api/notes/:id', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error reading notes from database');
      }

      const db = JSON.parse(data);

      const filteredNotes = db.filter((note) => note.id !== req.params.id);

      if (filteredNotes.length === db.length) {
        // No notes were deleted
        return res.status(404).send('Note not found');
      }

      fs.writeFile(path.join(__dirname, '../db/db.json'), JSON.stringify(filteredNotes), (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Error writing notes to database');
        }

        res.sendStatus(204);
      });
    });
  });
};