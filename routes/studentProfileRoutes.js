// routes/studentProfileRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, requireStudent } = require("../middleware/verifyToken");
const { getProfile, updateProfile } = require("../controllers/studentProfileController");

router.get("/me", verifyToken, requireStudent, getProfile);
router.put("/me", verifyToken, requireStudent, updateProfile);

module.exports = router;
