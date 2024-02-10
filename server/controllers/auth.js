const User = require("../models/UserModel");
const OTP = require("../models/OtpModel");
const bcrypt = require("bcrypt");

const sendOtp = async (req, res) => {
  const generateOtp = () => {
    let otp = "";
    for (let i = 0; i < 6; i++) {
      otp += Math.floor(Math.random() * 10);
    }
    return otp;
  };
  try {
    const otp = generateOtp();

    await OTP.deleteMany({ email: req.body.email });

    const otpBody = await OTP.create({ email: req.body.email, otp });
    res.status(200).json({
      message: "OTP sent successfully",
    });
    console.log(otpBody);
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ error: err.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req?.body;
  const result = await OTP.findOne({ email, otp });

  if (result) {
    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } else {
    console.log("OTP entered is wrong");
    res.status(400).json({ success: false, message: "OTP entered is wrong" });
  }
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  console.log({ email, password });
  const result = await User.findOne({ email: email });

  if (!result) {
    await bcrypt.hash(password, 10).then((hash) => {
      // const newUser = await User.create(user);
      User.create({ ...req.body, password: hash })
        .then((user) => {
          res.status(200).json({
            success: true,
            user: user.email,
            message: "User added successfully",
          });
        })
        .catch((err) => {
          res.json(400).json({
            success: false,
            message: err.message,
          });
        });
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req?.body;

  const user = await User.findOne({ email: email });
  console.log("User logged in successfully");
  if (user) {
    bcrypt.compare(password, user.password, async (err, result) => {
      if (result) {
        res.status(200).json({
          success: true,
          user: user.email,
          message: "User logged in successfully",
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    });
  } else {
    res.status(400).json({
      success: false,
      message: "User does not exist",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, user) => {
        if (err) {
          res.status(400).json({ message: "Error while logging out" });
        } else {
          const email = user?.email;
          await User.findOneAndUpdate({ email }, { refreshToken: "" });

          res.status(200).json({ message: "Logged out successfully" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Error while logging out" });
  }
};

module.exports = { sendOtp, registerUser, loginUser, logoutUser, verifyOtp };
