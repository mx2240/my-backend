// api/index.js
const express = require("express");

const app = express();

// Simple test route
app.get("/api", (req, res) => {
    res.json({ message: "✅ Serverless API is running!" });
});

// Export app for Vercel
module.exports = app;
