const Fee = require("../models/Fee");
const AssignFee = require("../models/AssignFee");
const Student = require("../models/Student");

exports.getMyFees = async (req, res) => {
    try {
        const studentId = req.student.id;

        // Ensure student exists
        const student = await Student.findById(studentId);
        if (!student)
            return res.status(404).json({ ok: false, message: "Student not found" });

        // Get fees assigned to this student
        const assignedFees = await AssignFee.find({ student: studentId })
            .populate("fee")
            .sort({ createdAt: -1 });

        return res.json({
            ok: true,
            message: "Fees retrieved successfully",
            fees: assignedFees
        });

    } catch (err) {
        console.error("getMyFees error:", err);
        return res.status(500).json({
            ok: false,
            message: "Server error",
            error: err.message
        });
    }
};
