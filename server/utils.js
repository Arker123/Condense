const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "cs305.t07@gmail.com",
    pass: "yzzbvwarlkvtozqj",
  },
});

module.exports = { transporter };
