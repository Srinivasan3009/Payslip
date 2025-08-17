const express = require('express');
const path = require('path'); // ✅ You missed this
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db.js'); // Your database controller
const cookieParser = require("cookie-parser");
const verifyToken = require('./middleware/auth.js');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
dotenv.config();
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000', // Adjust to match your frontend's URL
  credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));
// Serve static frontend files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// Root route to serve the index.html
app.get('/',(req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.get('/attendance',verifyToken,(req,res)=>{
  res.sendFile(path.join(__dirname,'public','attendance.html'));
});

app.get('/dashboard', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public','dashboard.html'));
});

app.get('/AttendanceForm', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public','AttendanceForm.html'));
});

app.get('/SubjectForm', verifyToken, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'SubjectForm.html'));
});

// API routes
app.use('/api', require('./routes/staff.js'));
app.use('/api', require('./routes/checkIn.js'));
app.use('/api', require('./routes/dashboard.js'));
app.use('/api', require('./routes/user.js'));

//logout path
app.get('/logout', (req, res) => {
  res.clearCookie('token'); // 🧼 Clear the auth token
  res.redirect('/'); // 👋 Redirect to login page
});

// Start server
app.listen(5870, () => {
  console.log("🚀 Server is running at http://localhost:5870");
});
