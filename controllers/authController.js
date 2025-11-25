// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const RefreshToken = require("../models/RefreshToken"); // optional

const signAccessToken = (user) => jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
const signRefreshToken = (user) => jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ ok: false, message: "All fields required" });

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ ok: false, message: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, role: role || "student" });

        // generate tokens
        const token = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        if (RefreshToken) {
            await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 86400000) }).catch(() => { });
        }

        return res.status(201).json({ ok: true, body: { token, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ ok: false, message: "Email & password required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ ok: false, message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ ok: false, message: "Invalid credentials" });

        const token = signAccessToken(user);
        const refreshToken = signRefreshToken(user);
        if (RefreshToken) {
            await RefreshToken.create({ user: user._id, token: refreshToken, expiresAt: new Date(Date.now() + 7 * 86400000) }).catch(() => { });
        }

        return res.json({ ok: true, body: { token, refreshToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};

exports.refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ ok: false, message: "Token required" });
        // verify stored refresh token mechanism if implemented
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.id);
        if (!user) return res.status(401).json({ ok: false, message: "Invalid refresh token" });

        const newAccess = signAccessToken(user);
        return res.json({ ok: true, body: { token: newAccess } });
    } catch (err) {
        console.error("refresh error", err);
        return res.status(401).json({ ok: false, message: "Invalid refresh token" });
    }
};
