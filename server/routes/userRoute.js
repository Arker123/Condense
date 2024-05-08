const express = require("express");
const { getUser, getUserFromEmail } = require("../controllers/user");

const Router = express.Router;
const router = new Router();

router.post("/", getUser);
router.post("/email", getUserFromEmail);

module.exports = router;
