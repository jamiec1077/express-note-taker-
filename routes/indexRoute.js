const path = require('path');

module.exports = (app) => {
  // Serve the notes.html file at the /notes route
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
  });

  // Serve the index.html file at the root route
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
};