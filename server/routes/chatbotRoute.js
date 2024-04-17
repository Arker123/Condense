
const { generateResponse } = require("../controllers/chatbot");

const express = require("express");
const router = new express.Router();

router.post("/generate", generateResponse);


module.exports = router;
