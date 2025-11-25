

const express = require("express");
const router = express.Router();
const { createStudent, getStudents } = require("../controllers/studentsController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.post("/", verifyToken, verifyAdmin, createStudent);
router.get("/", verifyToken, getStudents);
module.exports = router;

