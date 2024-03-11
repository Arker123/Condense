const express = require("express");
const { getTranscript } = require("../controllers/transcript");
const router = new express.Router();

router.post("/", getTranscript);
module.exports = router;
