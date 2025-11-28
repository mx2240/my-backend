const mongoose = require("mongoose");

const assignedStudentSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        fee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Fee",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "paid"],
            default: "pending",
        },
    },
    { timestamps: true }
);

// Prevent overwrite model error
const AssignedStudent =
    mongoose.models.AssignedStudent ||
    mongoose.model("AssignedStudent", assignedStudentSchema);

module.exports = AssignedStudent;
