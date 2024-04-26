const express = require("express");
const { getTranscript, getTs } = require("../controllers/transcript");

const router = new express.Router();

router.post("/", getTranscript);
router.post('/up',getTs);

module.exports = router;
