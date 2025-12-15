const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/adminStatsController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Only admins can access
router.get("/dashboard-stats", verifyToken, verifyAdmin, getDashboardStats);

module.exports = router;
