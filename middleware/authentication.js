const jwtDecode = require("jwt-decode");

const Users = require("../models/db/users");

/**
 * When applied to a route, it pulls the JWT off of 
 * the "authorization" header on the request object
 * and validates that a user has the proper access
 * permissions
 * 
 * @param  {Object} req
 * @param  {Object} res
 * @param  {function} next
 */
export const authentication = async (req, res, next) => {
  const token = req.get("Authorization");
  const { email } = jwtDecode(token);
  const validUser = await Users.find({ 'u.email': email }).first()

  if (email) {
    if (validUser) {
      next();
    } else {
      return res.status(401).json({error: "Invalid token"});
    }
  } else {
    return res.status(401).json({
      error: "No token provided, token must be set on the Authorization Header",
    });
  }
}
