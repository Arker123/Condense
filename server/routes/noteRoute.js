const express = require("express");
const {
    getAllNotes,
    getFavNotes,
    modifyNote,
    createNote,
    getNote,
    deleteNote,
    modifyFavNotes,
} = require("../controllers/note");

const router = new express.Router();

router.get("/all", getAllNotes);
router.get("/one", getNote);
router.get("/fav", getFavNotes);
router.post("/modify", modifyNote);

router.post("/create", createNote);
router.delete("/delete", deleteNote);
router.post("/getFav", modifyFavNotes);

module.exports = router;
