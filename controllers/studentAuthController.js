const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.studentLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ ok: false, message: "Email and password required" });
        }

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(400).json({ ok: false, message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, student.password);
        if (!match) {
            return res.status(400).json({ ok: false, message: "Invalid email or password" });
        }

        // Create student token
        const token = jwt.sign(
            { id: student._id, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            ok: true,
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                studentClass: student.studentClass
            }
        });

    } catch (err) {
        console.error("studentLogin error", err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};
