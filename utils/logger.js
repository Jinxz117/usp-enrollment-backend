const fs = require("fs");
const path = require("path");

// Define the log file path
const logFilePath = path.join(__dirname, "../logs/server-errors.log");

// Function to log errors to a file
const logErrorToFile = (error) => {
  const logEntry = `[${new Date().toISOString()}] ${error}\n\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });
};

module.exports = logErrorToFile;