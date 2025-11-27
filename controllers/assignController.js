const AssignedFee = require("../models/AssignedStudent");
const Student = require("../models/Student");
const Fee = require("../models/Fee");

// Assign a fee to a student
exports.assignFeeToStudent = async (req, res) => {
    try {
        const { studentId, feeId } = req.body;

        if (!studentId || !feeId) {
            return res.status(400).json({ ok: false, message: "Student and Fee are required" });
        }

        const exists = await AssignedFee.findOne({ student: studentId, fee: feeId });

        if (exists) {
            return res.status(400).json({ ok: false, message: "Fee already assigned" });
        }

        const assigned = await AssignedFee.create({
            student: studentId,
            fee: feeId,
        });

        res.json({ ok: true, assigned });
    } catch (error) {
        console.error("assignFeeToStudent error", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Get all assigned students for one fee
exports.getAssignedStudents = async (req, res) => {
    try {
        const feeId = req.params.feeId;

        const data = await AssignedFee.find({ fee: feeId })
            .populate("student")
            .populate("fee");

        res.json({ ok: true, data });
    } catch (error) {
        console.error("getAssignedStudents error", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Update fee payment status
exports.updateFeeStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updated = await AssignedFee.findByIdAndUpdate(
            req.params.assignId,
            { status },
            { new: true }
        );

        res.json({ ok: true, updated });
    } catch (error) {
        console.error("updateFeeStatus error", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Delete assigned fee
exports.deleteAssignedFee = async (req, res) => {
    try {
        await AssignedFee.findByIdAndDelete(req.params.assignId);
        res.json({ ok: true, message: "Assigned fee removed" });
    } catch (error) {
        console.error("deleteAssignedFee error", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Get all assigned fees for one student
exports.getAssignedFees = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const data = await AssignedFee.find({ student: studentId }).populate("fee");
        res.json({ ok: true, data });
    } catch (error) {
        console.error("getAssignedFees error", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};



module.exports = {
    assignFeeToStudent,
    getAssignedStudents,
    updateFeeStatus,
    deleteAssignedFee,
    getAssignedFees
};