// controllers/adminStudentController.js
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Student = require("../models/Student");

// list paginated
exports.listStudents = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 10 } = req.query;
        const q = {};
        if (search) q.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
        const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
        const [students, total] = await Promise.all([
            Student.find(q).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
            Student.countDocuments(q),
        ]);
        res.json({ ok: true, body: { students, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// flat list for dropdowns
exports.listAllStudents = async (req, res) => {
    try {
        const students = await Student.find({}, "name email").sort({ name: 1 }).lean();
        res.json({ ok: true, body: students });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { name, email, password, studentClass, phone } = req.body;
        // create or reuse user
        let user = await User.findOne({ email });
        if (!user) {
            const pw = password || "123456";
            user = await User.create({ name, email, password: await bcrypt.hash(pw, 10), role: "student" });
        }
        // ensure student object not linked already
        const existing = await Student.findOne({ user: user._id });
        if (existing) return res.status(400).json({ ok: false, message: "Student already linked" });

        const student = await Student.create({ user: user._id, name, email, studentClass, phone });
        res.status(201).json({ ok: true, body: student });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) return res.status(400).json({ ok: false, message: "Duplicate record" });
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, studentClass, phone } = req.body;
        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ ok: false, message: "Not found" });
        // update linked user
        await User.findByIdAndUpdate(student.user, { name, email });
        student.name = name || student.name;
        student.email = email || student.email;
        student.studentClass = studentClass || student.studentClass;
        student.phone = phone || student.phone;
        await student.save();
        res.json({ ok: true, body: student });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ ok: false, message: "Not found" });
        await User.findByIdAndDelete(student.user).catch(() => { });
        await Student.findByIdAndDelete(id);
        res.json({ ok: true, message: "Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};
