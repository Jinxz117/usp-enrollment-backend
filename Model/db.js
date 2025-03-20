require("dotenv").config();
const mysql = require("mysql2");

// MySQL Connection Pool Configuration
const pool = mysql.createPool({
  host: "127.0.0.1", // Use localhost for local MySQL
  user: "root", // Your MySQL username
  password: "Narayan@170296", // Your MySQL password
  database: "usp_enrollment", // Your database name
  port: 3307, // Change if using a different MySQL port
  connectionLimit: 10, // Max concurrent connections
  connectTimeout: 10000, // 10 sec timeout
  waitForConnections: true, // Wait when pool is full
});

// ✅ Export promise-based pool for async/await queries
const db = pool.promise();

module.exports = db;
