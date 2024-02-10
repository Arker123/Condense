const mongoose = require("mongoose");
const { transporter } = require("../utils.js");

const { Schema } = mongoose;

const otpSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // The otp will expire after 5 minutes of its creation time
  },
});
// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    const info = await transporter.sendMail({
      from: "cs305.t07@gmail.com",
      to: email, // list of receivers
      subject: "OTP Verification", // Subject line
      html: `<p>Your otp for verification is ${otp}. It will expire in 5 minutes.</p>`, // plain text body
    });
    console.log("Message sent", info.messageId);
  } catch (error) {
    console.log("Error occurred while sending email: ", error);
    throw error;
  }
}

otpSchema.pre("save", async function (next) {
  console.log("New otp saved to database");
  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", otpSchema);
