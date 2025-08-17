const db = require('../config/db'); // Ensure this is your MariaDB pool
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    {
      staff_id:user.staff_id, email:user.email, name:user.name
    },
    process.env.JWT_SECRET,
    {expiresIn:"2d"}
  );
}; 

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password" });
  }

  let conn;
  try {
    conn = await db.getConnection(); // ✅ Await the connection

    const rows = await conn.query('SELECT * FROM staff WHERE email = ?', [email]); // ✅ Use parameterized query

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    if (user.password_hash !== password) {
      console.log("invalid data");
      return res.status(400).json({ message: "Invalid credentials" }); 
    }
    const token = generateToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      secure: false, // set to true if using HTTPS
      sameSite: 'lax' // or 'strict'
    });
    
    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong!" });
  } finally {
    if (conn) conn.release(); // ✅ Release the connection
  }
};

module.exports = { loginUser };
