const jwt = require("jsonwebtoken");
const jwtDecode = require("jwt-decode");
const jwtKey =
  process.env.JWT_SECRET ||
  "add a .env file to root of project with the JWT_SECRET variable";

const Users = require("../models/db/users");

module.exports = {
  authenticate
};

// implementation details
function authenticate(req, res, next) {
  //Gets the token
  const token = req.get("Authorization");
  //Decodes the token
  const decoded = jwtDecode(token);

  //Checks if token exists, if not send 401 back.
  if (decoded) {
    if (Users.findByEmail(decoded.email)) {
      next();
    } else {
      return res.status(401).json({ error: "Invalid token" });
    }
  } else {
    return res.status(401).json({
      error: "No token provided, token must be set on the Authorization Header"
    });
  }
}

// // implementation details
// function authenticate(req, res, next) {
//     const token = req.get("Authorization");
//     const decoded = jwtDecode(token);

//     //   console.log(decoded);

//     if (token) {
//       jwt.verify(token, jwtKey, (err, decoded) => {
//         if (err) return res.status(401).json(err);
//         req.decodedJwt = decoded;

//         next();
//       });
//     } else {
//       return res.status(401).json({
//         error: "No token provided, token must be set on the Authorization Header",
//       });
//     }
//   }
