const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        description: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Fee || mongoose.model("Fee", feeSchema);
