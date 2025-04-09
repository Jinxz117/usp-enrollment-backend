// require("dotenv").config();
// const mysql = require("mysql2");

// // MySQL Connection Pool Configuration
// const pool = mysql.createPool({
//   host: "127.0.0.1", // Use localhost for local MySQL
//   user: "root", // Your MySQL username
//   password: "Narayan@170296", // Your MySQL password
//   database: "usp_enrollment", // Your database name
//   port: 3307, // Change if using a different MySQL port
//   connectionLimit: 10, // Max concurrent connections
//   connectTimeout: 10000, // 10 sec timeout
//   waitForConnections: true, // Wait when pool is full
// });

// // ✅ Export promise-based pool for async/await queries
// const db = pool.promise();

// module.exports = db;

require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// MySQL Connection Pool Configuration
let pool;
try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "127.0.0.1", // Use environment variables or defaults
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Narayan@170296",
    database: process.env.DB_NAME || "usp_enrollment",
    port: process.env.DB_PORT || 3307,
    connectionLimit: 10,
    connectTimeout: 10000,
    waitForConnections: true,
  });
  console.log("Database connection pool created successfully.");
} catch (error) {
  console.error("Error creating database connection pool:", error);
  process.exit(1); // Exit the application if the pool cannot be created
}

// ✅ Export promise-based pool for async/await queries
const db = pool.promise();

// Log file path for query and error logging
const logFilePath = path.join(__dirname, "../logs/db-errors.log");

// Function to log errors to a file
const logErrorToFile = (error, query = null, params = null) => {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] Error: ${error.message}\nQuery: ${query || "N/A"}\nParams: ${JSON.stringify(params) || "N/A"}\n\n`;

  fs.appendFile(logFilePath, logEntry, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    }
  });
};

// Wrapper function for executing queries with error handling
const executeQuery = async (query, params = []) => {
  try {
    console.log("Executing Query:", query);
    console.log("With Parameters:", params);
    const [results, fields] = await db.query(query, params);
    return [results, fields];
  } catch (error) {
    console.error("Database Query Error:", error);
    logErrorToFile(error, query, params); // Log the error to a file
    throw { code: "DB_QUERY_ERROR", message: "An error occurred while executing the database query.", details: error.message };
  }
};

module.exports = {
  query: executeQuery,
};