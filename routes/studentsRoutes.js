const express = require("express");

const router = express.Router();
const { createStudent, getStudents } = require("../controllers/studentsController");
// const { addStudent, getStudents } = require("../controllers/studentController");

// POST add student
router.post("/", createStudent);

// GET all students
router.get("/", getStudents);


module.exports = router;



