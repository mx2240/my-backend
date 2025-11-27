const router = require("express").Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { getMe, updateProfile, changePassword } = require("../controllers/adminSettingsController");

router.get("/me", verifyToken, getMe);
router.put("/update-profile", verifyToken, updateProfile);
router.post("/change-password", verifyToken, changePassword);

module.exports = router;
