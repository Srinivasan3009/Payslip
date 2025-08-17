const express = require('express');
const db = require('../config/db');
const router = express.Router();
const verifyToken = require('../middleware/auth'); // Ensure the route is protected

// Route to get staff data
router.get('/staff', verifyToken, async (req, res) => {
  try {
    conn = await db.getConnection(); // ✅ Await the connection
    const rows = await conn.query('SELECT * FROM staff WHERE staff_id = ?', [req.user.staff_id]); // ✅ Use parameterized query
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const user = rows[0];
// Get staff by staff_id (or modify to get all staff)
    conn.release();
    if (rows.length === 0) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.json(user); // Send the staff data as response
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
