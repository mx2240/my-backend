const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true }, // store image URL or Base64
        date: { type: String }, // optional
        location: { type: String }, // optional
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // optional
    },
    { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
