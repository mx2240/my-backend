
const Event = require("../models/Event");

const eventController = {
    createEvent: async (req, res) => {
        try {
            const event = new Event(req.body);
            await event.save();
            res.status(201).json(event);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getAllEvents: async (req, res) => {
        try {
            const events = await Event.find().sort({ createdAt: -1 });
            res.status(200).json(events);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    getEventById: async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ message: "Event not found" });
            }
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

module.exports = eventController;
