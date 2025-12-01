// const mongoose = require("mongoose");

// const studentSchema = new mongoose.Schema(
//     {
//         name: { type: String, required: true },
//         email: { type: String, required: true, unique: true },
//         classLevel: { type: String, default: "" },
//         studentClass: { type: String, default: "" },
//         phone: { type: String, default: "" },
//         password: { type: String, required: true },


//     },
//     { timestamps: true }
// );

// // FIX: Correct model export (prevents OverwriteModelError)
// module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);


const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true }, // 🔥 IMPORTANT
        classLevel: { type: String, default: "" },
        studentClass: { type: String, default: "" },
        phone: { type: String, default: "" }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Student || mongoose.model("Student", studentSchema);

