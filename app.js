
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for frontend communication

// Test route to check if the server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

module.exports = app;


/*
const express = require("express");

const app = express();
app.use(express.json());

// Test route to check if the server is running
app.get("/", (req, res) => {
  res.send("Server is running!");
});

module.exports = app;

*/