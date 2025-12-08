


const express = require("express");
const router = express.Router();
const { createEvent, getAllEvents, getEventById } = require("../controllers/eventController");

// Create event
router.post("/create", createEvent);

// Get all events
router.get("/", getAllEvents);

// Get event by ID
router.get("/:id", getEventById);

module.exports = router;