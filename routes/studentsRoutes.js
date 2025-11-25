const express = require("express");

const router = express.Router();

const { addStudent, getStudents } = require("../controllers/studentController");

// POST add student
router.post("/", addStudent);

// GET all students
router.get("/", getStudents);


module.exports = router;



