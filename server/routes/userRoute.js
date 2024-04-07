const express = require("express");
const { getUser } = require("../controllers/user");

const Router = express.Router;
const router = new Router();

router.post("/", getUser);

module.exports = router;
