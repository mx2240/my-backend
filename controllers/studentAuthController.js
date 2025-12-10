// controllers/studentAuthController.js
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ ok: false, message: "Email and password required" });

        const student = await Student.findOne({ email });
        if (!student)
            return res.status(400).json({ ok: false, message: "Invalid email or password" });

        const match = await bcrypt.compare(password, student.password);
        if (!match)
            return res.status(400).json({ ok: false, message: "Invalid email or password" });

        // FIX: include email in token
        const token = jwt.sign(
            { id: student._id, email: student.email, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            ok: true,
            message: "Login successful",
            token,
            student
        });

    } catch (err) {
        console.error("studentLogin error:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};



// =============================
// STUDENT FORGOT PASSWORD
// =============================
exports.studentForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const student = await Student.findOne({ email });
        if (!student)
            return res.status(404).json({ message: "Student not found" });

        const resetToken = crypto.randomBytes(32).toString("hex");

        student.resetPasswordToken = resetToken;
        student.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
        await student.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Email setup
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "8d67879ff1b33c",
                pass: "0f88feb071b5eb"
            }
        });



        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: "Student Password Reset",
            html: `
                <h2>Reset Your Password</h2>
                <p>Click the link below to reset your password:</p>
                <a href="${resetLink}" style="padding:10px 20px;background:#007bff;color:white;text-decoration:none;">Reset Password</a>
                <p>This link expires in 15 minutes.</p>
            `,
        });

        res.json({ message: "Password reset link sent to email" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// =============================
// STUDENT RESET PASSWORD
// =============================
exports.studentResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const student = await Student.findOne({
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

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};
