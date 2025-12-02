// controllers/studentProfileController.js
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");

exports.getProfile = async (req, res) => {
    try {
        const id = req.user.id; // expects JWT to contain id
        const student = await Student.findById(id).select("-password").lean();
        if (!student) return res.status(404).json({ ok: false, message: "Student not found" });
        res.json({ ok: true, student });
    } catch (err) {
        console.error("getProfile error:", err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const { name, phone, studentClass, password } = req.body;
        const update = { name, phone, studentClass };

        if (password && password.length >= 6) {
            update.password = await bcrypt.hash(password, 10);
        }

        const student = await Student.findByIdAndUpdate(id, { $set: update }, { new: true }).select("-password");
        if (!student) return res.status(404).json({ ok: false, message: "Student not found" });
        res.json({ ok: true, student });
    } catch (err) {
        console.error("updateProfile error:", err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};
