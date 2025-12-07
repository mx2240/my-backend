// const Fee = require("../models/Fee");
// const AssignFee = require("../models/AssignedStudent");
// const Student = require("../models/Student");

// exports.getMyFees = async (req, res) => {
//     try {
//         const studentId = req.student.id;

//         // Ensure student exists
//         const student = await Student.findById(studentId);
//         if (!student)
//             return res.status(404).json({ ok: false, message: "Student not found" });

//         // Get fees assigned to this student
//         const assignedFees = await AssignFee.find({ student: studentId })
//             .populate("fee")
//             .sort({ createdAt: -1 });

//         return res.json({
//             ok: true,
//             message: "Fees retrieved successfully",
//             fees: assignedFees
//         });

//     } catch (err) {
//         console.error("getMyFees error:", err);
//         return res.status(500).json({
//             ok: false,
//             message: "Server error",
//             error: err.message
//         });
//     }
// };



// controllers/studentFeesController.js
const AssignFee = require("../models/AssignedStudent");
const Fee = require("../models/Fee");
const Student = require("../models/Student");

exports.getMyFees = async (req, res) => {
    try {
        const studentId = req.user.id;

        const student = await Student.findById(studentId).lean();
        if (!student) {
            return res.status(404).json({ ok: false, message: "Student not found" });
        }

        let assigned = await AssignFee.find({ student: studentId })
            .populate("fee")
            .sort({ createdAt: -1 })
            .lean();

        // 🔥 Filter out broken records where fee = null
        assigned = assigned.filter(item => item.fee !== null);

        return res.json({ ok: true, fees: assigned });
    } catch (err) {
        console.error("getMyFees error:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};

