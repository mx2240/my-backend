const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { enrollStudent, getAllEnrollments } = require("../controllers/enrollmentController");

// Admin enrollment
router.post("/admin/enroll", verifyToken, verifyAdmin, enrollStudent);

// Get all enrollments (admin)
router.get("/", verifyToken, verifyAdmin, getAllEnrollments);

module.exports = router;
