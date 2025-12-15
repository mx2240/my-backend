const Student = require("../models/Student");
const Fee = require("../models/Fee");
const AssignedFee = require("../models/AssignedStudent");

exports.getDashboardStats = async (req, res) => {
    try {
        // ====== BASIC COUNTS ======
        const totalStudents = await Student.countDocuments();
        const totalFees = await Fee.countDocuments();
        const totalAssignedFees = await AssignedFee.countDocuments();

        // ====== TOTAL REVENUE (PAID ONLY) ======
        const revenueAgg = await AssignedFee.aggregate([
            { $match: { status: "paid" } },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$paidAmount" },
                },
            },
        ]);

        const totalRevenue = revenueAgg[0]?.total || 0;

        // ====== MONTHLY STUDENTS ======
        const studentAgg = await Student.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
        ]);

        // ====== MONTHLY REVENUE ======
        const revenueMonthlyAgg = await AssignedFee.aggregate([
            { $match: { status: "paid" } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$paidAmount" },
                },
            },
        ]);

        // Normalize data to 12 months
        const monthlyEnrollments = Array(12).fill(0);
        studentAgg.forEach(i => {
            monthlyEnrollments[i._id - 1] = i.count;
        });

        const monthlyRevenue = Array(12).fill(0);
        revenueMonthlyAgg.forEach(i => {
            monthlyRevenue[i._id - 1] = i.total;
        });

        res.json({
            ok: true,
            stats: {
                totalStudents,
                totalFees,
                totalAssignedFees,
                totalRevenue,
                monthlyEnrollments,
                monthlyRevenue,
            },
        });
    } catch (err) {
        console.error("Dashboard stats error:", err);
        res.status(500).json({
            ok: false,
            message: "Failed to load dashboard stats",
        });
    }
};
