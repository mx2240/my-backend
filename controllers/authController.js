const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --------------------
// REGISTER
// --------------------
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ ok: false, message: "Name, email and password are required" });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ ok: false, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword, role: role || "student" });

        // Generate tokens
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRE });

        res.status(201).json({
            ok: true,
            message: "Registration successful",
            user: { id: user._id, name: user.name, role: user.role },
            token,
            refreshToken
        });
    } catch (err) {
        console.error("register error:", err);
        res.status(500).json({ ok: false, message: "Server error", error: err.message });
    }
};

// --------------------
// LOGIN
// --------------------
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ ok: false, message: "Email and password are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ ok: false, message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ ok: false, message: "Invalid email or password" });

        // Generate tokens
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_SECRET, { expiresIn: process.env.REFRESH_EXPIRE });

        res.json({
            ok: true,
            message: "Login successful",
            user: { id: user._id, name: user.name, role: user.role },
            token,
            refreshToken
        });
    } catch (err) {
        console.error("login error:", err);
        res.status(500).json({ ok: false, message: "Server error", error: err.message });
    }
};
