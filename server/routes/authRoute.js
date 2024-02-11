const {
  loginUser,
  logoutUser,
  registerUser,
  sendOtp,
  verifyOtp,
  refresh,
} = require("../controllers/auth");

const express = require("express");

const Router = express.Router();

Router.post("/otp", sendOtp);
Router.post("/verifyOTP", verifyOtp);

Router.post("/register", registerUser);

Router.post("/refresh", refresh);

Router.post("/login", loginUser);

Router.get("/logout", logoutUser);

module.exports = Router;
