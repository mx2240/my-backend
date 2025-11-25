const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        studentId: { type: String, required: true, unique: true }, // Reg No / Index No
        classLevel: { type: String, required: true },
        phone: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
