const bcrypt = require("bcrypt");
const db = require("../Model/db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error", details: err.message });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // ✅ Ensure the token is properly generated and sent
    const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log("Generated Token:", token); // 🔍 Debugging line

    res.status(200).json({
      message: "Login successful",
      token, // ✅ Ensure token is sent
      user: { id: user.id, email: user.email, role_id: user.role_id },
    });
  });
};

module.exports = { loginUser };


// **Register User**
const registerUser = async (req, res) => {
    const { email, password, role_id } = req.body;

    if (!email || !password || !role_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error', details: err.message });

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        db.query(
            'INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)',
            [email, hashedPassword, role_id],
            (err, result) => {
                if (err) return res.status(500).json({ error: 'Error inserting user', details: err.message });
                res.status(201).json({ message: 'User registered successfully' });
            }
        );
    });
};

module.exports = { loginUser, registerUser };
