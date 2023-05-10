const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const notesFilePath = path.join(__dirname, "db", "notes.json");

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", function(req, res) {
  const notesData = JSON.parse(fs.readFileSync(notesFilePath));
  res.json(notesData);
});

app.post("/api/notes", function(req, res) {
  const newNote = req.body;
  newNote.id = uuidv4();
  const notesData = JSON.parse(fs.readFileSync(notesFilePath));
  notesData.push(newNote);
  fs.writeFileSync(notesFilePath, JSON.stringify(notesData));
  res.json(newNote);
});

app.delete("/api/notes/:id", function(req, res) {
  const noteId = req.params.id;
  const notesData = JSON.parse(fs.readFileSync(notesFilePath));
  const updatedNotesData = notesData.filter(note => note.id !== noteId);
  fs.writeFileSync(notesFilePath, JSON.stringify(updatedNotesData));
  res.json({ message: "Note deleted" });
});

app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});