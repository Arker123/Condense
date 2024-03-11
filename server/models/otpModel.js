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
/**
 * Sends a verification email with the provided OTP to the specified
 * email address.
 * @param {string} email - The email address to send the verification email to.
 * @param {string} otp - The OTP (One-Time Password) to include in the
 *                       verification email.
 * @throws {Error} If an error occurs while sending the email.
 */
async function sendVerificationEmail(email, otp) {
    try {
        const info = await transporter.sendMail({
            from: "DEP24.P01@outlook.com",
            to: email, // list of receivers
            subject: "OTP Verification", // Subject line
            html: `<p>
                Your otp for verification is ${otp}. 
                It will expire in 5 minutes.
            </p>`, // plain text body
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
  if (this.isNew) {                                       // eslint-disable-line
    await sendVerificationEmail(this.email, this.otp);    // eslint-disable-line
    }
    next();
});

module.exports = mongoose.model("OTP", otpSchema);
