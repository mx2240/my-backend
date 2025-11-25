// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ ok: false, message: "No token provided" });

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ ok: false, message: "Invalid auth header" });
    }

    const token = parts[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
};

const verifyAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Not authenticated" });
    if (req.user.role !== "admin") return res.status(403).json({ ok: false, message: "Admin access required" });
    next();
};

const verifyStudent = (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: "Not authenticated" });
    if (req.user.role !== "student") return res.status(403).json({ ok: false, message: "Student access required" });
    next();
};

module.exports = { verifyToken, verifyAdmin, verifyStudent };
