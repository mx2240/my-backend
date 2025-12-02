const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        classLevel: { type: String, default: "" },
        studentClass: { type: String, default: "" },
        phone: { type: String, default: "" }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);
