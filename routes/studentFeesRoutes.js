// const express = require("express");
// const router = express.Router();

// const { getMyFees } = require("../controllers/studentFeesController");
// const studentAuth = require("../middleware/studentAuth");

// // Protected route
// router.get("/my-fees", studentAuth, getMyFees);

// module.exports = router;


// routes/studentFeesRoutes.js
const express = require("express");
const router = express.Router();
const { verifyToken, requireStudent } = require("../middleware/verifyToken");
const { getMyFees } = require("../controllers/studentFeesController");

router.get("/my-fees", verifyToken, requireStudent, getMyFees);

module.exports = router;

