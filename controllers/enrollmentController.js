// controllers/enrollmentController.js
const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

exports.adminEnroll = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const s = await Student.findById(studentId);
        const c = await Course.findById(courseId);
        if (!s || !c) return res.status(404).json({ ok: false, message: "Student or course not found" });

        const e = await Enrollment.create({ student: studentId, course: courseId });
        res.status(201).json({ ok: true, body: e });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) return res.status(400).json({ ok: false, message: "Already enrolled" });
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.getAllEnrollments = async (req, res) => {
    try {
        const list = await Enrollment.find().populate("student", "name email").populate("course", "title").lean();
        res.json({ ok: true, body: list });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Student endpoints (optional)
exports.enrollStudent = async (req, res) => {
    try {
        const studentId = req.user.id; // if student user maps to Student doc, adjust accordingly
        const courseId = req.params.courseId;
        const e = await Enrollment.create({ student: studentId, course: courseId });
        res.status(201).json({ ok: true, body: e });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.dropCourse = async (req, res) => {
    try {
        const studentId = req.user.id;
        const courseId = req.params.courseId;
        await Enrollment.deleteOne({ student: studentId, course: courseId });
        res.json({ ok: true, message: "Dropped" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const studentId = req.user.id;
        const list = await Enrollment.find({ student: studentId }).populate("course").lean();
        res.json({ ok: true, body: list });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};
