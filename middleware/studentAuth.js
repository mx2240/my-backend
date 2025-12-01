const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(401).json({ ok: false, message: "Access denied - No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.role !== "student") {
            return res.status(403).json({ ok: false, message: "Forbidden - Not a student" });
        }

        req.student = decoded;
        next();

    } catch (err) {
        return res.status(401).json({ ok: false, message: "Invalid token" });
    }
};
