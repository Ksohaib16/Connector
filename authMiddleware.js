const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

// Middleware to validate JWT token
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(403).json({error: "Unauthorized, Please make account first"});
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next(); // If token is valid, move to the next middleware or route
    } else{
      return res.status(403).json({error: "Invalid token"})
    }
  } catch (err) {
    return res.status(403).json({error: "something wrong"}); // If token is invalid, return unauthorized error
  }
};

module.exports = authMiddleware;
 