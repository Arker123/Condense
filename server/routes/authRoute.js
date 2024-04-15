const {
    loginUser,
    logoutUser,
    registerUser,
    sendOtp,
    verifyOtp,
    refresh,
    updatePassword
} = require("../controllers/auth");

const express = require("express");

const Router = express.Router;
const router = new Router();

router.post("/otp", sendOtp);
router.post("/verifyOTP", verifyOtp);

router.post("/register", registerUser);

router.post("/refresh", refresh);

router.post("/login", loginUser);

router.get("/logout", logoutUser);

router.post("/updatePassword", updatePassword);

module.exports = router;
