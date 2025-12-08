const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/verifyToken");

const {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controllers/eventController");

// Admin create event
router.post("/", verifyToken, requireAdmin, createEvent);

// Get all events (public or admin)
router.get("/", getEvents);

// Get single event
router.get("/:id", getEventById);

// Update event
router.put("/:id", verifyToken, requireAdmin, updateEvent);

// Delete event
router.delete("/:id", verifyToken, requireAdmin, deleteEvent);

module.exports = router;
