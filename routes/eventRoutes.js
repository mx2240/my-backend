const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
    createEvent,
    getEvents,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

// CREATE EVENT (with image)
router.post("/create", upload.single("image"), createEvent);

// UPDATE EVENT (with new image optional)
router.put("/:id", upload.single("image"), updateEvent);

// GET ALL
router.get("/", getEvents);

// DELETE
router.delete("/:id", deleteEvent);

module.exports = router;
