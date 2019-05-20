/**
 * Middleware to catch all errors occurring on all routes.
 *
 * Ensures that we don't need to use Try/Catch blocks inside
 * of our routes.
 *
 * @module errorHandling
 * @function
 * @param  {Object} err - A JavaScript error object
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {function} next - Express next middleware function
 */
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const env = process.env.NODE_ENV || "development";
  let error;
  if (env === "development" && statusCode > 499) {
    console.error(err);
    error = `Error during ${req.method} at ${req.path}: ${err.message}`;
  }

  if (env === "production") {
    error = "An error occurred while processing your request.";
  }
  res.status(statusCode).json({ error });
};
