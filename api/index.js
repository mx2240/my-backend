

const serverless = require("serverless-http");
const app = require("../app"); // Import your express app

module.exports = serverless(app);
