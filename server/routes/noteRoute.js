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
router.get('/one', getNote);
router.post('/modify', modifyNote);

router.post('/create', createNote);
router.delete('/delete', deleteNote);

module.exports = router;
