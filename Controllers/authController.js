// const bcrypt = require("bcrypt");
// const db = require("../Model/db");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: "Email and password are required", code: "LOGIN_VALIDATION_ERROR" });
//   }

//   const sql = "SELECT * FROM users WHERE email = ?";
//   db.query(sql, [email], async (err, results) => {
//     if (err) return res.status(500).json({ error: "Database error", details: err.message });

//     if (results.length === 0) {
//       return res.status(401).json({ message: "Invalid email or password", code: "INVALID_CREDENTIALS" });
//     }

//     const user = results[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password", code: "INVALID_CREDENTIALS" });
//     }

//     // ✅ Ensure the token is properly generated and sent
//     const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     console.log("Generated Token:", token); // 🔍 Debugging line

//     res.status(200).json({
//       message: "Login successful",
//       token, // ✅ Ensure token is sent
//       user: { id: user.id, email: user.email, role_id: user.role_id },
//     });
//   });
// };

// module.exports = { loginUser };


// // **Register User**
// const registerUser = async (req, res) => {
//     const { email, password, role_id } = req.body;

//     if (!email || !password || !role_id) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Check if user already exists
//     db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
//         if (err) return res.status(500).json({ error: 'Database error', details: err.message , code: 'DB_QUERY_ERROR' });

//         if (results.length > 0) {
//             return res.status(400).json({ message: 'Email already in use', code: 'EMAIL_ALREADY_IN_USE' });
//         }

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert new user
//         db.query(
//             'INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)',
//             [email, hashedPassword, role_id],
//             (err, result) => {
//                 if (err) return res.status(500).json({ error: 'Error inserting user', details: err.message , code: 'USER_INSERT_ERROR' });
//                 res.status(201).json({ message: 'User registered successfully' });
//             }
//         );
//     });
// };

// module.exports = { loginUser, registerUser };


const bcrypt = require("bcrypt");
const db = require("../Model/db"); // Import the updated db.js
const jwt = require("jsonwebtoken");
require("dotenv").config();

// **Login User**
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required", code: "LOGIN_VALIDATION_ERROR" });
  }

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [results] = await db.query(sql, [email]); // Use promise-based query

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password", code: "INVALID_CREDENTIALS" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password", code: "INVALID_CREDENTIALS" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token, // ✅ Send token to the client
      user: { id: user.id, email: user.email, role_id: user.role_id },
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ error: "Error during login", code: "LOGIN_ERROR" });
  }
};

// **Register User**
const registerUser = async (req, res) => {
  const { email, password, role_id } = req.body;

  if (!email || !password || !role_id) {
    return res.status(400).json({ message: "All fields are required", code: "REGISTER_VALIDATION_ERROR" });
  }

  try {
    // Check if user already exists
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]); // Use promise-based query

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already in use", code: "EMAIL_ALREADY_IN_USE" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db.query("INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)", [email, hashedPassword, role_id]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Error registering user", code: "REGISTER_ERROR" });
  }
};

module.exports = { loginUser, registerUser };