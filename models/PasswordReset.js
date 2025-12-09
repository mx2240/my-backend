// const mongoose = require("mongoose");

// const passwordResetSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     token: { type: String, required: true },
//     expiresAt: { type: Date, required: true }
// }, { timestamps: true });

// module.exports = mongoose.model("PasswordReset", passwordResetSchema);



const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model("PasswordReset", passwordResetSchema);
