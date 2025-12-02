// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ message: "No token provided" });

//     const token = authHeader.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; // { id, role }
//         next();
//     } catch (err) {
//         return res.status(401).json({ message: "Invalid token" });
//     }
// };

// module.exports = verifyToken;


// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ ok: false, message: "No token provided" });

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return res.status(401).json({ ok: false, message: "Invalid auth header" });

    const token = parts[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload; // { id, role }
        return next();
    } catch (err) {
        return res.status(401).json({ ok: false, message: "Invalid or expired token" });
    }
}

function requireStudent(req, res, next) {
    if (!req.user) return res.status(401).json({ ok: false, message: "Not authenticated" });
    if (req.user.role !== "student") return res.status(403).json({ ok: false, message: "Student access required" });
    next();
}

function requireAdmin(req, res, next) {
    if (!req.user) return res.status(401).json({ ok: false, message: "Not authenticated" });
    if (req.user.role !== "admin") return res.status(403).json({ ok: false, message: "Admin access required" });
    next();
}

module.exports = { verifyToken, requireStudent, requireAdmin };

