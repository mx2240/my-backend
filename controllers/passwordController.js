const User = require("../models/user");
const PasswordReset = require("../models/PasswordReset");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// SEND RESET EMAIL
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Delete old tokens for safety
        await PasswordReset.deleteMany({ userId: user._id });

        // Create secure token
        const token = crypto.randomBytes(32).toString("hex");

        await PasswordReset.create({
            userId: user._id,
            token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 15), // 15 mins expiry
        });

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        // EMAIL SENDER
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset",
            html: `
                <h2>Password Reset Request</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link expires in 15 minutes.</p>
            `,
        });

        res.json({ message: "Password reset link sent to email" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Error sending password reset email" });
    }
};


// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const resetRecord = await PasswordReset.findOne({ token });

        if (!resetRecord)
            return res.status(400).json({ message: "Invalid or expired token" });

        if (resetRecord.expiresAt < new Date())
            return res.status(400).json({ message: "Token expired" });

        const user = await User.findById(resetRecord.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Hash new password
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        await user.save();

        // Delete reset token
        await PasswordReset.deleteMany({ userId: user._id });

        res.json({ message: "Password reset successful. You can now login." });

    } catch (error) {
        console.error("Reset Error:", error);
        res.status(500).json({ message: "Error resetting password" });
    }
};
