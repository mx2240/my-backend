const mongoose = require("mongoose");

const AssignedStudentSchema = new mongoose.Schema(
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

module.exports =
    mongoose.models.AssignedStudent ||
    mongoose.model("AssignedStudent", AssignedStudentSchema);
