
// controllers/studentsController.js
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

/**
 * GET /api/students
 */
async function getStudents(req, res) {
    try {
        const { page = 1, limit = 20, search = "" } = req.query;

        const q = {};
        if (search) q.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ];

        const skip = (Math.max(1, Number(page)) - 1) * Number(limit);

        const [students, total] = await Promise.all([
            Student.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Student.countDocuments(q)
        ]);

        return res.json({
            ok: true,
            students,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });

    } catch (err) {
        console.error("getStudents error:", err);
        return res.status(500).json({ ok: false, message: "Server error", error: err.message });
    }
}


/**
 * POST /api/students
 * Automatically generates hashed password so student can log in
 */
async function createStudent(req, res) {
    try {
        const { name, email, password = "123456", studentClass, phone } = req.body;

        const exists = await Student.findOne({ email });
        if (exists) return res.status(400).json({ ok: false, message: "Email already taken" });

        const hashed = await bcrypt.hash(password, 10);

        const student = await Student.create({
            name,
            email,
            password: hashed,
            studentClass,
            phone,
        });

        return res.json({ ok: true, student });
    } catch (err) {
        return res.status(500).json({ ok: false, message: "Server error", error: err.message });
    }
}

module.exports = { createStudent, getStudents };

