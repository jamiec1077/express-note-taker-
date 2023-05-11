const fs = require('fs');//read & wriite file
const path = require('path')//load built-in path module

var uniqid = require('uniqid');

module.exports = (app) =>
{
 //when the client navigate to localhost:3001/api/notes the server sends the data from the db
  app.get('/api/notes', (req,res) =>
  {
    res.sendFile(path.join(__dirname, '../db/db.json'));
  });

  //localhost:3001/api/notes
  app.post('/api/notes',(req,res) => {
    fs.readFile('db/db.json', (err, data) => {
      if (err) throw err;
      let db = JSON.parse(data);
      let userNote = {
        title: req.body.title,
        text: req.body.text,
        id: uniqid(), //each note have unique id
      };  
      //Push the new data
      db.push(userNote);
      fs.writeFile('db/db.json', JSON.stringify(db), (err) => {
        if (err) throw err;
        res.json(db);
      });
    });
  });

  //localhost:3000/api/notes/id(454656)
  app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('db/db.json', (err, data) => {
      if (err) {
        throw err;
      }
      let db = JSON.parse(data);
      // removing note with id
      let deleteNotes = db.filter(item => item.id !== req.params.id);
      // Rewriting note to db.json
      fs.writeFile('db/db.json', JSON.stringify(deleteNotes), err => {
        if (err) {
          throw err;
        }
        res.json(deleteNotes);
      });
    });
  });
};