/**
 * Middleware to verify the existence of a valid Slack user token.
 *
 * Used in POST /api/responses/slack endpoint in Responses controller
 * to verify that user is authorized by Slack.
 *
 * Verification token is found on the slack API under Basic Info --> App Credentials --> Verification Token
 *
 * @see https://api.slack.com/
 *
 * @module verifySlackToken
 * @function
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {function} next - Express next middleware function
 */

module.exports = (req, res, next) => {
  const { token } = req.body;
  if (token === process.env.SLACK_VERIFICATION) {
    next();
  }
};
