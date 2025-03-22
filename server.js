const cors = require("cors");
require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const { pool } = require("./Model/db"); // Import connection pool
const studentRoutes = require("./Routes/studentRoutes"); // Ensure correct path
const gradeRoutes = require("./Routes/gradeRoutes");
const financeRoutes = require("./Routes/financeRoutes");
const enrollmentRoutes = require("./Routes/enrollmentRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const port = 4149;

// Routes
app.use('/api', studentRoutes);
app.use('/api', gradeRoutes);
app.use("/api/finances", financeRoutes);
app.use('/api', enrollmentRoutes);


// Signup Route (Register User)
app.post("/signup", async (req, res) => {
  const { email, password, role_id } = req.body;

  if (!email || !password || !role_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Check if user already exists
    const [existingUser] = await pool.promise().query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await pool.promise().query(
      "INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)", 
      [email, hashedPassword, role_id]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login Route (Authenticate User)
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Find user by email
    const [users] = await pool.promise().query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Send success response
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role_id: user.role_id }
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Error during login" });
  }
});

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    res.status(200).json({ message: "Database connected successfully!" });
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});