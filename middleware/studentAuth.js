// const Student = require("../models/Student");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.studentLogin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password)
//             return res.status(400).json({ ok: false, message: "Email and password required" });

//         const student = await Student.findOne({ email });
//         if (!student)
//             return res.status(400).json({ ok: false, message: "Invalid email or password" });

//         const match = await bcrypt.compare(password, student.password);
//         if (!match)
//             return res.status(400).json({ ok: false, message: "Invalid email or password" });

//         const token = jwt.sign(
//             { id: student._id, role: "student" },
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         );

//         return res.json({
//             ok: true,
//             message: "Login successful",
//             token,
//             student
//         });

//     } catch (err) {
//         console.error("studentLogin error:", err);
//         return res.status(500).json({ ok: false, message: "Server error", error: err.message });
//     }
// };



const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ ok: false, message: "No token provided" });

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.student = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ ok: false, message: "Invalid or expired token" });
    }
};


