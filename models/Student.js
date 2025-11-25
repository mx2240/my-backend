const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        classLevel: { type: String, default: "" },   // fix
        studentClass: { type: String, default: "" },
        phone: { type: String, default: "" }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
