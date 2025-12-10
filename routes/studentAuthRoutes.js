// // routes/studentAuthRoutes.js
// const express = require("express");
// const router = express.Router();

// const { studentLogin } = require("../controllers/studentAuthController");

// router.post("/login", studentLogin);

// module.exports = router;



const express = require("express");
const router = express.Router();

const {
    studentLogin,
    studentForgotPassword,
    studentResetPassword
} = require("../controllers/studentAuthController");

router.post("/login", studentLogin);

// Add these:
router.post("/forgot-password", studentForgotPassword);
router.post("/reset-password/:token", studentResetPassword);

module.exports = router;

