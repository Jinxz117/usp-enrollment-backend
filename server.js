const cors = require("cors");
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
//const { pool } = require("./Model/db"); // Import connection pool

const db = require("./Model/db"); // Import the updated db.js

const studentRoutes = require("./Routes/studentRoutes"); // Ensure correct path
const gradeRoutes = require("./Routes/gradeRoutes");
const financeRoutes = require("./Routes/financeRoutes");
const enrollmentRoutes = require("./Routes/enrollmentRoutes");
const programRequirementRoutes = require("./Routes/programRequirementRoutes");
const logErrorToFile = require("./utils/logger");

const app = express();
app.use(express.json());
app.use(cors());

const port = 4149;

// Routes
app.use('/api', studentRoutes);
app.use('/api', gradeRoutes);
app.use("/api/finances", financeRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api/program-requirements', programRequirementRoutes);

// Override console.error to log errors to a file
const originalConsoleError = console.error;
console.error = (...args) => {
  // Log the error to the console
  originalConsoleError(...args);

  // Log the error to the file
  const errorMessage = args.map(arg => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg)).join(" ");
  logErrorToFile(errorMessage);
};


// // Signup Route (Register User)
// app.post("/signup", async (req, res) => {
//   const { email, password, role_id } = req.body;

//   if (!email || !password || !role_id) {
//     return res.status(400).json({ error: "All fields are required" , code: "SIGNUP_VALIDATION_ERROR"});
//   }

//   try {
//     // Check if user already exists
//     const [existingUser] = await pool.promise().query("SELECT * FROM users WHERE email = ?", [email]);
//     if (existingUser.length > 0) {
//       return res.status(400).json({ error: "Email already in use" , code:  "EMAIL_ALREADY_IN_USE" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Insert new user
//     await pool.promise().query(
//       "INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)", 
//       [email, hashedPassword, role_id]
//     );

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     console.error("Error registering user:", err);
//     res.status(500).json({ error: "Failed to register user", code: "SIGNUP_ERROR" });
//   }
// });

// // Login Route (Authenticate User)
// app.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "Email and password are required", code: "LOGIN_VALIDATION_ERROR" });
//   }

//   try {
//     // Find user by email
//     const [users] = await pool.promise().query("SELECT * FROM users WHERE email = ?", [email]);

//     if (users.length === 0) {
//       return res.status(401).json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" });
//     }

//     const user = users[0];

//     // Compare entered password with hashed password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" });
//     }

//     // Send success response
//     res.status(200).json({
//       message: "Login successful",
//       user: { id: user.id, email: user.email, role_id: user.role_id }
//     });
//   } catch (err) {
//     console.error("Error during login:", err);
//     res.status(500).json({ error: "Error during login", code: "LOGIN_ERROR" });
//   }
// });

// Replace pool.promise().query with db.query
app.post("/signup", async (req, res) => {
  const { email, password, role_id } = req.body;

  if (!email || !password || !role_id) {
    return res.status(400).json({ error: "All fields are required", code: "SIGNUP_VALIDATION_ERROR" });
  }

  try {
    // Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use", code: "EMAIL_ALREADY_IN_USE" }); //error goes to console n logger
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db.query("INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)", [email, hashedPassword, role_id]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Failed to register user", code: "SIGNUP_ERROR" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required", code: "LOGIN_VALIDATION_ERROR" });
  }

  try {
    // Find user by email
    const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" });
    }

    const user = users[0];

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password", code: "INVALID_CREDENTIALS" });
    }

    // Send success response
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role_id: user.role_id },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Error during login", code: "LOGIN_ERROR" });
  }
});


// Test database connection
// app.get("/test-db", async (req, res) => {
//   try {
//     const connection = await pool.promise().getConnection();
//     res.status(200).json({ message: "Database connected successfully!" });
//     connection.release();
//   } catch (error) {
//     console.error("Database connection failed:", error);
//     res.status(500).json({ error: "Database connection failed", code: "DB_CONNECTION_ERROR" });
//   }
// });

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1"); // Simple query to test the connection
    res.status(200).json({ message: "Database connected successfully!" });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ error: "Database connection failed", code: "DB_CONNECTION_ERROR" });
  }
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err); // This will log to both console and file
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
    code: err.code || "INTERNAL_SERVER_ERROR",
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});