// api/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ---- CONNECT TO MONGO ----
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error("❌ Missing MONGO_URL in environment variables");
    process.exit(1);
}

mongoose
    .connect(MONGO_URL)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));

// ---- IMPORT ROUTES ----
// (Add routes gradually as you test)
app.get("/", (req, res) => {
    res.json({ message: "API is working 🎉" });
});

// Example:
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);

// ---- EXPORT FOR VERCEL ----
module.exports = app;
