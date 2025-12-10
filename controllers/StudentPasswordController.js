const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/Student");
const nodemailer = require("nodemailer");

// SEND EMAIL FUNCTION
const sendEmail = async (to, subject, html) => {
    try {
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "8d67879ff1b33c",
                pass: "0f88feb071b5eb"
            }
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
        console.error(error);
        res.status(500).json({ message: "Error sending reset link" });
    }
};
// ======================
// FORGOT PASSWORD
// ======================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const student = await User.findOne({ email, role: "student" });
        if (!student) return res.status(404).json({ message: "Student not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");

        student.resetPasswordToken = resetToken;
        student.resetPasswordExpires = Date.now() + 1000 * 60 * 15; // 15 mins
        await student.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail(
            student.email,
            "Reset Your Password",
            `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password</p>
                <a href="${resetLink}" style="padding:10px 20px;background:#007bff;color:white;">Reset Password</a>
            `
        );

        res.json({ message: "Reset link sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending reset link" });
    }
};

// ======================
// RESET PASSWORD
// ======================
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const student = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!student)
            return res.status(400).json({ message: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(password, salt);
        student.resetPasswordToken = undefined;
        student.resetPasswordExpires = undefined;

        await student.save();

        res.json({ message: "Password reset successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error resetting password" });
    }
};
