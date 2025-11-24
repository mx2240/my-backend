// app.js
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB()
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Import routes
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const courseRoutes = require("./routes/coursesRoutes");
const studentRoutes = require("./routes/studentsRoutes");
const adminRoutes = require("./routes/adminRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const inquiryRoutes = require("./routes/inquiryRoutes");
const feesRoutes = require("./routes/feesRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const timetableRoutes = require("./routes/timetableRoutes");
const libraryRoutes = require("./routes/libraryRoutes");
const hostelRoutes = require("./routes/hostelRoutes");
const transportRoutes = require("./routes/transportRoutes");
const driverRoutes = require("./routes/driverRoutes");
const busAttendanceRoutes = require("./routes/busAttendanceRoutes");
const parentRoutes = require("./routes/parentRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");
const adminProfileRoutes = require("./routes/adminProfileRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
const gradeRoutes = require("./routes/gradeRoutes");
const userRoutes = require("./routes/userRoutes"); // optional additional routes

// Initialize Express
const app = express();

// Middleware
app.use(express.json());
app.use(require("cors")({
    origin: "https://my-frontend-brown-eta.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Mount API Routes
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/grades", gradeRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/attendance", attendanceRoutes); // general attendance
app.use("/api/attendance/bus", busAttendanceRoutes); // bus attendance
app.use("/api/timetable", timetableRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/transport", transportRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/hostels", hostelRoutes);
app.use("/api/parents", parentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/admin/profile", adminProfileRoutes);
app.use("/api/admin/students", adminStudentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); // optional additional user routes

// Root route for health check
app.get("/", (req, res) => {
    res.json({ message: "✅ School API running successfully" });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("🔥 SERVER ERROR:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
});




const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));



// module.exports = app;
