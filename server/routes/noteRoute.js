const express = require("express");
const {
  getAllNotes,
  modifyNote,
  createNote,
  getNote,
  deleteNote,
} = require("../controllers/note");
const Router = express.Router();

Router.get("/all", getAllNotes);
Router.get("/", getNote);
Router.put("/", modifyNote);

Router.post("/", createNote);
Router.delete("/", deleteNote);

module.exports = Router;
