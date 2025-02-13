const checkRole = (role) => {
  return (req, res, next) => {
    // Log the req.user and role to check the values
    console.log("Request user:", req.user); // Log the whole user object (including role)
    console.log("Required role:", role); // Log the required role (e.g., "student", "admin")

    // Check if req.user exists and if their role matches the required role
    if (!req.user) {
      console.log("No user found in request.");
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided." });
    }

    if (req.user.role !== role) {
      console.log("Role mismatch:", req.user.role); // Log if the roles don't match
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions." });
    }

    next(); // Allow the request to proceed if the role matches
  };
};

module.exports = checkRole;
