const Event = require("../models/Event");

// Create new event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, image, date, location } = req.body;

        if (!title || !description || !image) {
            return res.status(400).json({ ok: false, message: "Title, description, and image are required." });
        }

        const newEvent = await Event.create({
            title,
            description,
            image,
            date,
            location,
            createdBy: req.user?.id || null
        });

        res.status(201).json({ ok: true, message: "Event created successfully", event: newEvent });

    } catch (err) {
        console.error("Create Event Error:", err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Get all events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }).lean();
        res.json({ ok: true, events });
    } catch (err) {
        console.error("Get Events Error:", err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Get single event
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ ok: false, message: "Event not found" });

        res.json({ ok: true, event });

    } catch (err) {
        console.error("Get Event Error:", err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Update event
exports.updateEvent = async (req, res) => {
    try {
        const { title, description, image, date, location } = req.body;

        const updated = await Event.findByIdAndUpdate(
            req.params.id,
            { title, description, image, date, location },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ ok: false, message: "Event not found" });
        }

        res.json({ ok: true, message: "Event updated", event: updated });

    } catch (err) {
        console.error("Update Event Error:", err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

// Delete event
exports.deleteEvent = async (req, res) => {
    try {
        const deleted = await Event.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ ok: false, message: "Event not found" });

        res.json({ ok: true, message: "Event deleted" });

    } catch (err) {
        console.error("Delete Event Error:", err);
        res.status(500).json({ ok: false, message: "Server error" });
    }
};

