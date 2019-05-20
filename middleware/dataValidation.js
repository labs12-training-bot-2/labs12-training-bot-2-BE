const Joi = require("@hapi/joi");

/**
 * Takes in a JOI schema object and returns a Middleware
 * function
 *
 * @module dataValidation
 * @function
 * @param {schema}
 * @return {function} An Express middleware function
 */
module.exports = schema => {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema);
    if (error) {
      console.log(error);
      return res.status(400).json({
        error: `Error during ${req.method} request: ${error.details[0].message}`
      });
    }
    next();
  };
};
