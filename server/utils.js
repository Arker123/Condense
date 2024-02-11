const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "outlook",
  auth: {
    user: "DEP24.P01@outlook.com",
    pass: "dep_24_p01",
  },
});

module.exports = { transporter };
