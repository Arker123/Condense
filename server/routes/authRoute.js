const {
  loginUser,
  logoutUser,
  registerUser,
  sendOtp,
} = require("../controllers/auth");
const express = require("express");

const Router = express.Router();

Router.post("/otp", sendOtp);

Router.post("/register", registerUser);

Router.post("/login", loginUser);

Router.get("/logout", logoutUser);

module.exports = Router;
