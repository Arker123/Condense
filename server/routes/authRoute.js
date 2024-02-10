import {
  loginUser,
  logoutUser,
  registerUser,
  sendOtp,
} from "../controllers/auth.js";


import express from "express";

const Router = express.Router();

Router.post("/otp", sendOtp);

Router.post("/register", registerUser);

Router.post("/login", loginUser);

Router.get("/logout", logoutUser);

export default Router;
