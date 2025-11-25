const Student = require("../models/Student");

// Add student
exports.addStudent = async (req, res) => {
    try {
        const { fullName, email, studentId, classLevel, phone } = req.body;

        if (!fullName || !email || !studentId || !classLevel) {
            return res.status(400).json({ message: "All required fields missing" });
        }

        // Check duplicates
        const emailExists = await Student.findOne({ email });
        if (emailExists) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const idExists = await Student.findOne({ studentId });
        if (idExists) {
            return res.status(409).json({ message: "Student ID already exists" });
        }

        const student = new Student({
            fullName,
            email,
            studentId,
            classLevel,
            phone,
        });

        await student.save();
        res.status(201).json({ message: "Student added successfully", student });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all students
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
