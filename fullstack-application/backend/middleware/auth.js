/* 
const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("token not found");
    return res.redirect("/");
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

    if (err) {
      console.log("token is not valid");
      return res.redirect("/");
    }
    console.log("token is valid");
    req.user = user;
    next();
  });
};

module.exports = verifyToken;
*/
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user data to the request object
    console.log(decoded);
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = verifyToken;
