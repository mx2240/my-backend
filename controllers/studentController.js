// controllers/studentsController.js
const Student = require("../models/Student");
const User = require("../models/user"); // optional: if you link to User accounts (comment out if not used)
const bcrypt = require("bcryptjs");

/**
 * GET /api/students
 * Query params: page, limit, search
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
            totalPages: Math.ceil(total / Number(limit))
        });
    } catch (err) {
        console.error("getStudents error:", err);
        return res.status(500).json({ ok: false, message: "Server error", error: err.message });
    }
}

/**
 * POST /api/students
 * Body: { name, email, password?, studentClass?, phone? }
 *
 * NOTE: This version creates a Student document. If you want to create a linked User account,
 * uncomment the section that creates a User and adjust to your User model.
 */
async function createStudent(req, res) {
    try {
        const { name, email, password = "123456", studentClass = "", phone = "" } = req.body;
        if (!name || !email) return res.status(400).json({ ok: false, message: "Name and email required" });

        // ensure unique email in Student collection
        const exists = await Student.findOne({ email });
        if (exists) return res.status(400).json({ ok: false, message: "Email already taken" });

        // Optional: if you keep separate User model and want to create linked user, use this block
        // (uncomment if you have a User model and want to create accounts automatically)
        //
        // let user = await User.findOne({ email });
        // if (!user) {
        //   const hashed = await bcrypt.hash(password, 10);
        //   user = await User.create({ name, email, password: hashed, role: "student" });
        // }

        const student = await Student.create({ name, email, studentClass, phone });
        return res.status(201).json({ ok: true, message: "Student created", student });
    } catch (err) {
        console.error("createStudent error:", err);
        // handle duplicate key for unique index gracefully
        if (err.code === 11000) {
            return res.status(400).json({ ok: false, message: "Duplicate value", error: err.message });
        }
        return res.status(500).json({ ok: false, message: "Server error", error: err.message });
    }
}

module.exports = { createStudent, getStudents };
