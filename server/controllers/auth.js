const User = require("../models/UserModel");
const OTP = require("../models/otpModel");
const bcrypt = require("bcrypt");
const tokenService = require("../services/token-service");
const { jwtDecode } = require("jwt-decode");
const jwt = require("jsonwebtoken");

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
        if (!req.body.email) {
            return res.status(400).json({ error: "Email cannot be empty" });
        }

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
    try {
        const { email, otp } = req?.body;

        if (!email || !otp) {
            return res
                .status(400)
                .json({ error: "Email and OTP cannot be empty" });
        }
        const result = await OTP.findOne({ email, otp });

        if (result) {
            res.status(200).json({
                success: true,
                message: "OTP verified successfully",
            });
        } else {
            res.status(400).json({
                success: false,
                message: "OTP entered is wrong",
            });
        }
    } catch (err) {
        console.log(err.message);
        res.status(400).json({ success: false, error: err.message });
    }
};

const registerUser = async (req, res) => {
    const { email, password, name } = req.body;
    console.log({ email, password, name });

    if (!email || !password || !name) {
        return res
            .status(400)
            .json({ error: "Email, password and name cannot be empty" });
    }
    const result = await User.findOne({ email: email });

    try {
        if (result) {
            return res
                .status(400)
                .json({ success: false, message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
        });

        const { accessToken, refreshToken } = tokenService.generateTokens({
            _id: newUser._id,
            activated: false,
        });

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        // eslint-disable-next-line no-unused-vars
        const { _password, ...user } = newUser._doc;

        res.status(200).json({
            success: true,
            user,
            message: "User added successfully",
            accessToken,
            // refreshToken
        });
        console.log("user  created");
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const refresh = async (req, res) => {
    // get refresh token from cookie
    const { refreshToken: refreshTokenFromCookie } = req.cookies;
    // check if token is valid
    let userData;
    try {
        userData = await tokenService.verifyRefreshToken(
            refreshTokenFromCookie,
        );
    } catch (err) {
        return res.status(401).json({ message: "Invalid Token" });
    }
    // Check if token is in db
    try {
        const token = await tokenService.findRefreshToken(
            userData._id,
            refreshTokenFromCookie,
        );
        if (!token) {
            return res.status(401).json({ message: "Invalid token" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal error" });
    }
    // check if valid user
    const user = await userService.findUser({ _id: userData._id });
    if (!user) {
        return res.status(404).json({ message: "No user" });
    }
    // Generate new tokens
    const { refreshToken, accessToken } = tokenService.generateTokens({
        _id: userData._id,
    });

    // Update refresh token
    try {
        await tokenService.updateRefreshToken(userData._id, refreshToken);
    } catch (err) {
        return res.status(500).json({ message: "Internal error" });
    }
    // put in cookie
    res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
    });
    // response
    res.json({ user: user, auth: true });
};

const loginUser = async (req, res) => {
    const { credential } = req.body;

    if (credential) {
        try {
            const cred = jwtDecode(credential);
            console.log(cred);
            const email = cred?.email;
            if (email) {
                const user = await User.findOne({ email });
                if (user) {
                    const refreshToken = jwt.sign(
                        { email },
                        process.env.JWT_REFRESH_TOKEN_SECRET,
                        {
                            expiresIn: "180d",
                        },
                    );
                    const accessToken = jwt.sign(
                        { email },
                        process.env.JWT_ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: "5m",
                        },
                    );
                    res.status(200).json({
                        success: true,
                        user: user,
                        message: "User logged in successfully",
                        accessToken,
                        refreshToken,
                    });
                } else {
                    const user = await User.create({
                        email: cred?.email,
                        name: cred?.name,
                    });
                    const refreshToken = jwt.sign(
                        { email },
                        process.env.JWT_REFRESH_TOKEN_SECRET,
                        {
                            expiresIn: "180d",
                        },
                    );
                    const accessToken = jwt.sign(
                        { email },
                        process.env.JWT_ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: "5m",
                        },
                    );
                    res.status(200).json({
                        success: true,
                        user,
                        accessToken,
                        refreshToken,
                        message: "User added successfully",
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    error: "Invalid credentials",
                });
            }
        } catch (err) {
            console.log(err.message);
            res.status(400).json({ success: false, error: err.message });
        }
        return;
    }

    try {
        const { email, password } = req?.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password cannot be empty",
            });
        }

        const user = await User.findOne({ email: email });
        console.log("User logged in successfully");
        if (user) {
            bcrypt.compare(password, user.password, async (err, result) => {
                if (result) {
                    // eslint-disable-next-line no-unused-vars
                    const { _password, ...resUser } = user._doc;

                    const refreshToken = jwt.sign(
                        { email },
                        process.env.JWT_REFRESH_TOKEN_SECRET,
                        {
                            expiresIn: "180d",
                        },
                    );
                    const accessToken = jwt.sign(
                        { email },
                        process.env.JWT_ACCESS_TOKEN_SECRET,
                        {
                            expiresIn: "5m",
                        },
                    );

                    res.status(200).json({
                        success: true,
                        user: resUser,
                        message: "User logged in successfully",
                        accessToken,
                        refreshToken,
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
    } catch (err) {
        console.log(err);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_TOKEN_SECRET,
            async (err, user) => {
                if (err) {
                    res.status(400).json({
                        message: "Error while logging out",
                    });
                } else {
                    const email = user?.email;
                    await User.findOneAndUpdate(
                        { email },
                        { refreshToken: "" },
                    );

                    res.status(200).json({
                        message: "Logged out successfully",
                    });
                }
            },
        );
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error while logging out" });
    }
};

const updatePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Validate incoming data
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Email, oldPassword, and newPassword are required",
            });
        }

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Compare old password with the hashed password stored in the database
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        await User.updateOne({ email }, { password: hashedPassword });

        res.status(200).json({
            success: true,
            message: "Password updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

module.exports = {
    sendOtp,
    registerUser,
    loginUser,
    verifyOtp,
    refresh,
    logoutUser,
    updatePassword
};