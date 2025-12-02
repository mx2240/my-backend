// routes/studentsRoutes.js
const express = require("express");
const router = express.Router();

const { createStudent, getStudents } = require("../controllers/studentController");
const { studentLogin } = require("../controllers/studentAuthController");

router.post("/login", studentLogin);

router.post("/", createStudent);
router.get("/", getStudents);

module.exports = router;
