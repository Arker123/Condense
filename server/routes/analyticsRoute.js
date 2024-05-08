const express = require("express");
const { getAnalytics } = require("../controllers/analytics");

const router = new express.Router();
router.post("/", getAnalytics);

module.exports = router;
