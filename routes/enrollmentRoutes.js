// routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin, verifyStudent } = require("../middleware/authMiddleware");
const enrollmentController = require("../controllers/enrollmentController");

router.post("/admin/enroll", verifyToken, verifyAdmin, enrollmentController.adminEnroll);
router.get("/", verifyToken, verifyAdmin, enrollmentController.getAllEnrollments);

// Student routes (if needed)
router.post("/enroll/:courseId", verifyToken, verifyStudent, enrollmentController.enrollStudent);
router.post("/drop/:courseId", verifyToken, verifyStudent, enrollmentController.dropCourse);
router.get("/my-courses", verifyToken, verifyStudent, enrollmentController.getMyCourses);

module.exports = router;
