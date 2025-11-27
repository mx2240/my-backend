// controllers/feeController.js
const Fee = require("../models/Fee");
const Student = require("../models/Student");

// Create Fee
exports.createFee = async (req, res) => {
    try {
        const { title, amount } = req.body;

        if (!title || !amount) {
            return res.status(400).json({ ok: false, message: "Title & amount required" });
        }

        const fee = await Fee.create({ title, amount });

        return res.status(201).json({ ok: true, message: "Fee created", fee });
    } catch (error) {
        console.error("Create fee error:", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Get All Fees
exports.getFees = async (req, res) => {
    try {
        const fees = await Fee.find().sort({ createdAt: -1 });

        res.json({ ok: true, fees });
    } catch (error) {
        console.error("Fetch fees error:", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Assign Fee to Students
exports.assignFee = async (req, res) => {
    try {
        const { feeId } = req.params;
        const { students } = req.body; // array of student IDs

        if (!students || students.length === 0) {
            return res.status(400).json({ ok: false, message: "No students selected" });
        }

        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ ok: false, message: "Fee not found" });

        students.forEach((id) => {
            if (!fee.assignedStudents.some((s) => s.student.toString() === id)) {
                fee.assignedStudents.push({
                    student: id,
                    status: "unpaid"
                });
            }
        });

        await fee.save();

        res.json({ ok: true, message: "Students assigned successfully" });
    } catch (error) {
        console.error("Assign fee error:", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Get Assigned Students for a Fee
exports.getAssignedStudents = async (req, res) => {
    try {
        const { feeId } = req.params;

        const fee = await Fee.findById(feeId).populate("assignedStudents.student");

        if (!fee) return res.status(404).json({ ok: false, message: "Fee not found" });

        res.json({ ok: true, assignedStudents: fee.assignedStudents });
    } catch (error) {
        console.error("Get assigned students error:", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Update Payment Status (paid/unpaid)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { feeId, studentId } = req.params;
        const { status } = req.body; // "paid" or "unpaid"

        const fee = await Fee.findById(feeId);
        if (!fee) return res.status(404).json({ ok: false, message: "Fee not found" });

        const studentEntry = fee.assignedStudents.find(
            (s) => s.student.toString() === studentId
        );

        if (!studentEntry) {
            return res.status(404).json({ ok: false, message: "Student not assigned" });
        }

        studentEntry.status = status;
        await fee.save();

        res.json({ ok: true, message: "Status updated" });
    } catch (error) {
        console.error("Update status error:", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Delete a fee
exports.deleteFee = async (req, res) => {
    try {
        const { id } = req.params;

        const fee = await Fee.findByIdAndDelete(id);
        if (!fee) return res.status(404).json({ ok: false, message: "Fee not found" });

        res.json({ ok: true, message: "Fee deleted successfully" });
    } catch (error) {
        console.error("Delete fee error:", error);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};
