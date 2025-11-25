// controllers/feesController.js
const Fee = require("../models/Fee");
const FeeAssignment = require("../models/FeeAssignment"); // simple schema linking student+fee
const Student = require("../models/Student");

exports.createFee = async (req, res) => {
    try {
        const { title, amount, description } = req.body;
        const fee = await Fee.create({ title, amount, description });
        res.status(201).json({ ok: true, body: fee });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.getFees = async (req, res) => {
    try {
        const fees = await Fee.find().lean();
        res.json({ ok: true, body: fees });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.assignFee = async (req, res) => {
    try {
        const { studentId, feeId } = req.body;
        const s = await Student.findById(studentId);
        if (!s) return res.status(404).json({ ok: false, message: "Student not found" });
        const created = await FeeAssignment.create({ student: studentId, fee: feeId, status: "unpaid" });
        res.status(201).json({ ok: true, body: created });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) return res.status(400).json({ ok: false, message: "Already assigned" });
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.getAssigned = async (req, res) => {
    try {
        const list = await FeeAssignment.find().populate("student", "name email").populate("fee").lean();
        res.json({ ok: true, body: list });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.markPaid = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await FeeAssignment.findByIdAndUpdate(id, { status: "paid" }, { new: true });
        if (!updated) return res.status(404).json({ ok: false, message: "Not found" });
        res.json({ ok: true, body: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.deleteFee = async (req, res) => {
    try {
        await Fee.findByIdAndDelete(req.params.id);
        res.json({ ok: true, message: "Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};
