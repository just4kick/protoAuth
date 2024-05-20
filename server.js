const express = require("express");
const route = require("./Route/routes");
const ip = require("ip");
const dotenv = require("dotenv");
const logger = require("./log/logger");
const cors = require("cors");

const app = express();

// Load environment variables from .env file
dotenv.config();

// Define environment variable for the server port
const PORT = process.env.SERVER_PORT || 4001;

// Middleware
// Enable CORS for all origins
app.use(cors());

// Enable parsing JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ report: "OK", message: "Auth Server Up and Running. Version 1.0.0. Use /api prefix to access api." });
});

// Use routes defined in the external routes file
app.use("/api", route);

app.listen(PORT, () => {
  logger.info(`Server Started on ${ip.address()}:${PORT}`);
});
