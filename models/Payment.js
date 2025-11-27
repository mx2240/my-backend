const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
    {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
        fee: { type: mongoose.Schema.Types.ObjectId, ref: "Fee", required: true },
        amount: Number,
        transactionId: String,
        status: { type: String, default: "successful" },
    },
    { timestamps: true }
);

module.exports =
    mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
