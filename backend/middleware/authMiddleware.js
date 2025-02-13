const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    console.log("No token provided.");
    return res
      .status(401)
      .json({ message: "Unauthorized: No token provided." });
  }

  try {
    // Verify token and attach decoded data to req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data (including role) to req.user
    console.log("Authenticated user:", req.user); // Log the authenticated user
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.log("Token verification failed:", error);
    return res.status(403).json({ message: "Forbidden: Invalid token." });
  }
};

module.exports = authenticateToken;
