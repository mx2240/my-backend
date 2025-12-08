
// const Event = require("../models/Event");

// // CREATE EVENT
// exports.createEvent = async (req, res) => {
//     try {
//         const { title, description, image, date } = req.body;

//         if (!title || !description || !image) {
//             return res.status(400).json({ message: "Title, description & image are required" });
//         }

//         const event = await Event.create({ title, description, image, date });
//         res.status(201).json(event);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // GET ALL EVENTS
// exports.getEvents = async (req, res) => {
//     try {
//         const events = await Event.find().sort({ createdAt: -1 });
//         res.status(200).json(events);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// // Delete event
// exports.deleteEvent = async (req, res) => {
//     try {
//         await Event.findByIdAndDelete(req.params.id);
//         res.json({ message: "Event deleted" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };


// exports.updateEvent = async (req, res) => {
//     try {
//         const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updated);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



const Event = require("../models/Event");

// Create Event
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date } = req.body;

        const imageUrl = req.file ? req.file.path : null;

        const event = await Event.create({
            title,
            description,
            date,
            image: imageUrl
        });

        res.json({ ok: true, event });

    } catch (error) {
        console.error("Create Event Error:", error);
        res.status(500).json({ message: "Server error" });
    }
};


// Get All Events
exports.getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Update Event
exports.updateEvent = async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const imageUrl = req.file ? req.file.path : null;

        const updated = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                date,
                ...(imageUrl && { image: imageUrl })
            },
            { new: true }
        );

        res.json(updated);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Delete Event
exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
