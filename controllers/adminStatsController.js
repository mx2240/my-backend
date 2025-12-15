const Student = require("../models/Student");
const Course = require("../models/Course");
const Fee = require("../models/Fee");
const AssignedFee = require("../models/AssignedStudent");

const getDashboardStats = async (req, res) => {
    try {
        // Total counts
        const totalStudents = await Student.countDocuments();
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await AssignedFee.countDocuments();

        // Total fees collected
        const fees = await AssignedFee.find({ status: "paid" }).populate("fee");
        const totalFees = fees.reduce((acc, f) => acc + (f.fee?.amount || 0), 0);

        // Monthly trends (last 7 months)
        const months = [];
        const monthlyEnrollments = [];
        const monthlyFees = [];

        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0, 23, 59, 59);

            months.push(monthStart.toLocaleString("default", { month: "short" }));

            const enrollCount = await AssignedFee.countDocuments({
                createdAt: { $gte: monthStart, $lte: monthEnd },
            });
            monthlyEnrollments.push(enrollCount);

            const paidFees = await AssignedFee.find({
                status: "paid",
                createdAt: { $gte: monthStart, $lte: monthEnd },
            }).populate("fee");
            const monthFees = paidFees.reduce((acc, f) => acc + (f.fee?.amount || 0), 0);
            monthlyFees.push(monthFees);
        }

        res.json({
            ok: true,
            data: {
                totalStudents,
                totalCourses,
                totalEnrollments,
                totalFees,
                months,
                monthlyEnrollments,
                monthlyFees,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

module.exports = { getDashboardStats };
