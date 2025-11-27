const bcrypt = require("bcryptjs");
const User = require("../models/user");

// GET LOGGED-IN USER
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ ok: false, message: "User not found" });

        return res.json({ ok: true, user });
    } catch (err) {
        console.log("getMe error:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { name, email },
            { new: true }
        ).select("-password");

        return res.json({ ok: true, user: updated });
    } catch (err) {
        console.log("updateProfile error:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ ok: false, message: "User not found" });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(400).json({ ok: false, message: "Wrong current password" });

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        return res.json({ ok: true, message: "Password updated successfully" });
    } catch (err) {
        console.log("changePassword error:", err);
        return res.status(500).json({ ok: false, message: "Server error" });
    }
};
