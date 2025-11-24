// api/index.js

// Import your Express app
const app = require("../app"); // make sure this path points to your app.js

// Export the app for Vercel serverless
module.exports = app;
