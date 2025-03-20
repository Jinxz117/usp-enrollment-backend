const bcrypt = require('bcrypt');
const db = require('../config/db'); // Adjust based on your DB connection

// Function to register a new user with hashed password
const registerUser = async (req, res) => {
    const { email, password, role_id } = req.body;

    if (!email || !password || !role_id) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const saltRounds = 10; // Cost factor for hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const sql = 'INSERT INTO users (email, password, role_id) VALUES (?, ?, ?)';
        db.query(sql, [email, hashedPassword, role_id], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'User registered successfully!' });
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { registerUser };
