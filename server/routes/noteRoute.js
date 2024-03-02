const express = require('express');
const {
  getAllNotes,
  modifyNote,
  createNote,
  getNote,
  deleteNote,
} = require('../controllers/note');

const router = new express.Router();

router.get('/all', getAllNotes);
router.get('/', getNote);
router.put('/', modifyNote);

router.post('/', createNote);
router.delete('/', deleteNote);

module.exports = router;
