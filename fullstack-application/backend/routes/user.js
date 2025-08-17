const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');

const verifyToken = require('../middleware/auth');
// Route for user login
router.post('/login', loginUser);

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.clearCookie('session_cookie');
    sessionStorage.removeItem("subjects");
    res.redirect('http://localhost:5870/');
  });
});

module.exports = router ;
