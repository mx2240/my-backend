// routes/adminStudentRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const adminStudentController = require("../controllers/adminStudentController");

router.get("/all", verifyToken, verifyAdmin, adminStudentController.listAllStudents); // flat list
router.get("/", verifyToken, verifyAdmin, adminStudentController.listStudents); // paginated
router.post("/", verifyToken, verifyAdmin, adminStudentController.createStudent);
router.put("/:id", verifyToken, verifyAdmin, adminStudentController.updateStudent);
router.delete("/:id", verifyToken, verifyAdmin, adminStudentController.deleteStudent);

module.exports = router;
