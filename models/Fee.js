// const mongoose = require("mongoose");

// const FeeSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     amount: { type: Number, required: true },
//     description: { type: String, default: "" }   // ✅ Add this
// }, { timestamps: true });

// module.exports = mongoose.model("Fee", FeeSchema);


const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Fee", FeeSchema);
