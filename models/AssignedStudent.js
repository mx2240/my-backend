const mongoose = require("mongoose");

const AssignedFeeSchema = new mongoose.Schema({
    fee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Fee",
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    status: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
    },
    assignedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("AssignedFee", AssignedFeeSchema);
