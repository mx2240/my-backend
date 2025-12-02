// // routes/paymentsRoutes.js
// const express = require("express");
// const router = express.Router();
// const { verifyToken, requireStudent } = require("../middleware/verifyToken");
// const { initPaystack, verifyPaystack } = require("../controllers/paymentsController");

// router.post("/paystack/init", verifyToken, requireStudent, initPaystack);
// router.get("/paystack/verify", verifyToken, requireStudent, verifyPaystack);

// module.exports = router;


const express = require("express");
const router = express.Router();
const studentAuth = require("../middleware/studentAuth");
const { initPaystack, verifyPaystack } = require("../controllers/paymentsController");

router.post("/initiate", studentAuth, initPaystack);
router.get("/verify", verifyPaystack);

module.exports = router;
