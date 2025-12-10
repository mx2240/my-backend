const express = require("express");
const router = express.Router();
const controller = require("../controllers/StudentPasswordController");

router.post("/forgot-password", controller.forgotPassword);
router.post("/reset-password/:token", controller.resetPassword);

module.exports = router;
