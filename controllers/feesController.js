const Fee = require("../models/Fee");
const AssignedStudent = require("../models/AssignedStudent");

// Create Fee
const createFee = async (req, res) => {
    try {
        const { title, amount, dueDate } = req.body;
        const newFee = new Fee({ title, amount, dueDate });
        await newFee.save();
        res.status(201).json({ message: "Fee created successfully", fee: newFee });
    } catch (error) {
        console.error("Create Fee Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all fees
const getFees = async (req, res) => {
    try {
        const fees = await Fee.find().lean();
        res.json({ ok: true, fees });

    } catch (error) {
        console.error("Get Fees Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get a single fee
const getFeeById = async (req, res) => {
    try {
        const fee = await Fee.findById(req.params.id);

        if (!fee) {
            return res.status(404).json({ message: "Fee not found" });
        }

        res.json({ ok: true, fee });
    } catch (error) {
        console.error("Get Fee Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update Fee
const updateFee = async (req, res) => {
    try {
        const { title, amount, dueDate } = req.body;

        const fee = await Fee.findByIdAndUpdate(
            req.params.id,
            { title, amount, dueDate },
            { new: true }
        );

        if (!fee) {
            return res.status(404).json({ message: "Fee not found" });
        }

        res.json({ message: "Fee updated successfully", fee });
    } catch (error) {
        console.error("Update Fee Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete Fee
const deleteFee = async (req, res) => {
    try {
        const fee = await Fee.findByIdAndDelete(req.params.id);

        if (!fee) {
            return res.status(404).json({ message: "Fee not found" });
        }

        res.json({ message: "Fee deleted successfully" });
    } catch (error) {
        console.error("Delete Fee Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get fees assigned to a student
const getMyFees = async (req, res) => {
    try {
        const studentId = req.user.id;

        const assigned = await AssignedStudent.find({ student: studentId })
            .populate("fee");

        res.json({ ok: true, assigned });
    } catch (error) {
        console.error("Get My Fees Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// EXPORT ALL FUNCTIONS
module.exports = {
    createFee,
    getFees,
    getFeeById,
    updateFee,
    deleteFee,
    getMyFees,
};
