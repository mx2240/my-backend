// const Fee = require("../models/Fee");
const FeeAssignment = require("../models/FeeAssignment");
const Student = require("../models/Student");
const Fee = require("../models/feeModel");


// --- Create a Fee ---
async function createFee(req, res) {
    try {
        const { title, amount, description } = req.body;
        if (!title || !amount) return res.status(400).json({ ok: false, message: "Title and amount required" });

        const fee = await Fee.create({ title, amount, description });
        res.status(201).json({ ok: true, fee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: err.message });
    }
}

// --- Assign Fee to Student ---
async function assignFee(req, res) {
    try {
        const { studentId, feeId } = req.body;
        if (!studentId || !feeId) return res.status(400).json({ ok: false, message: "Student and Fee required" });

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ ok: false, message: "Student not found" });

        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ ok: false, message: "Fee not found" });

        // Prevent duplicate assignments
        const exists = await FeeAssignment.findOne({ student: studentId, fee: feeId });
        if (exists) return res.status(400).json({ ok: false, message: "Fee already assigned to student" });

        const assignment = await FeeAssignment.create({ student: studentId, fee: feeId });
        res.status(201).json({ ok: true, assignment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: err.message });
    }
}

// --- Get All Students with Fee Assignments ---
async function getStudentsWithFees(req, res) {
    try {
        const students = await Student.find().lean();
        const assignments = await FeeAssignment.find().populate("fee").lean();

        // Map fees to students
        const result = students.map(s => {
            const fees = assignments.filter(a => a.student.toString() === s._id.toString());
            return { ...s, fees };
        });

        res.json({ ok: true, students: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: err.message });
    }
}

// --- Update Fee Status (Paid/Unpaid) ---
async function updateFeeStatus(req, res) {
    try {
        const { assignmentId, status } = req.body;
        if (!["paid", "unpaid"].includes(status)) return res.status(400).json({ ok: false, message: "Invalid status" });

        const assignment = await FeeAssignment.findByIdAndUpdate(
            assignmentId,
            { status },
            { new: true }
        ).populate("student fee");

        if (!assignment) return res.status(404).json({ ok: false, message: "Assignment not found" });

        res.json({ ok: true, assignment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: err.message });
    }
}


async function getAllFees(req, res) {
    try {
        const fees = await Fee.find().sort({ createdAt: -1 }).lean();
        res.json({ ok: true, fees });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: err.message });
    }
}


async function deleteFee(req, res) {
    const id = req.params.id;

    await Fee.findByIdAndDelete(id);
    await FeeAssignment.deleteMany({ fee: id }); // clean linked records

    res.json({ ok: true, message: "Fee deleted" });
}


// GET students assigned to a fee
exports.getAssignedStudents = async (req, res) => {
    try {
        const feeId = req.params.feeId;

        const fee = await Fee.findById(feeId).populate("assignedStudents.student");

        if (!fee) {
            return res.status(404).json({ message: "Fee not found" });
        }

        res.json({
            ok: true,
            assignedStudents: fee.assignedStudents
        });
    } catch (error) {
        console.error("Get assigned students error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update paid/unpaid
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { feeId, studentId } = req.params;
        const { status } = req.body; // "paid" or "unpaid"

        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ message: "Fee not found" });

        const studentEntry = fee.assignedStudents.find(
            (item) => item.student.toString() === studentId
        );

        if (!studentEntry)
            return res.status(404).json({ message: "Student not assigned to fee" });

        studentEntry.status = status;
        await fee.save();

        res.json({ ok: true, message: "Status updated" });
    } catch (error) {
        console.error("Update payment status error:", error);
        res.status(500).json({ message: "Server error" });
    }
};






module.exports = {
    createFee,
    assignFee,
    getStudentsWithFees,
    updateFeeStatus,
    getAllFees,
    deleteFee

};


