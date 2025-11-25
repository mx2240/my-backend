const Enrollment = require("../models/Enrollment");
const Student = require("../models/Student");
const Course = require("../models/Course");

exports.enrollStudent = async (req, res) => {
    const { studentId, courseId } = req.body;

    if (!studentId || !courseId)
        return res.status(400).json({ ok: false, message: "Student and course are required" });

    try {
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ ok: false, message: "Student not found" });

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ ok: false, message: "Course not found" });

        // Check if already enrolled
        const existing = await Enrollment.findOne({ student: studentId, course: courseId });
        if (existing) return res.status(400).json({ ok: false, message: "Student already enrolled" });

        const enrollment = await Enrollment.create({ student: studentId, course: courseId });
        res.json({ ok: true, message: "Student enrolled successfully", enrollment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: err.message });
    }
};

exports.getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find()
            .populate("student", "name email")
            .populate("course", "title")
            .sort({ createdAt: -1 });
        res.json({ ok: true, enrollments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: err.message });
    }
};
