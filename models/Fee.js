const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        dueDate: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Fee || mongoose.model("Fee", FeeSchema);
