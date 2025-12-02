const express = require("express");
const router = express.Router();

const { getMyFees } = require("../controllers/studentFeesController");
const studentAuth = require("../middleware/studentAuth");

// Protected route
router.get("/my-fees", studentAuth, getMyFees);

module.exports = router;
