const express = require("express");
const router = express.Router();
const { createStudent, getStudents } = require("../controllers/studentController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Add student
router.post("/", verifyToken, verifyAdmin, createStudent);

// Get all students
router.get("/", verifyToken, getStudents);

module.exports = router;
