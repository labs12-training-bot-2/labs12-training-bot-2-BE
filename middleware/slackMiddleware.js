// Models
const Tokens = require("../models/db/tokens");
const TeamMembers = require("../models/db/teamMembers");

/**
 * Middleware to retrieve Slack token for authenticated user,
 * verify Slack DM chat History ID, and verify that Team Member being validated has slack_uuid
 *
 * Used in Slack controller endpoints
 *
 * Note that verifySlackID only validates that the specified Team Member has a Slack ID
 * but does not verify that the Slack ID is valid, this could be expanded upon in future versions
 *
 * @module slackMiddleware
 * @function
 * @param  {Object} req - Express request object
 * @param  {Object} res - Express response object
 * @param  {function} next - Express next middleware function
 */

module.exports = {
  getSlackToken,
  verifyHistoryID,
  verifySlackID
};

async function getSlackToken(req, res, next) {
  // Destructure email from authenticated User on res.locals
  const { email } = res.locals.user;

  // Attempt to find Token associated with authenticated User
  const token = await Tokens.find({
    "u.email": email,
    "s.name": "slack"
  }).first();

  if (token) {
    // If Token successfully retrieved, set its authentication token on res.locals User and call next middleware
    res.locals.user.token = token.auth_token;
    next();
  } else {
    // If Token is falsey, we can assume no Token exists for the authenticated User
    res
      .status(404)
      .json({ error: "Failed to retrieve Slack token from storage" });
  }
}

async function verifyHistoryID(req, res, next) {
  // Destructure email from authenticated User on res.locals
  const { email } = res.locals.user;

  // Destructure ID from request parameters
  const {
    params: { id }
  } = req;

  // Attempt to find Team Member associated with authenticated User
  const teamMember = await TeamMembers.find({
    "tm.id": id,
    "u.email": email
  }).first();

  if (teamMember) {
    // If Team Member successfully retrieved, set it on request body and call next middleware
    req.body.teamMember = teamMember;
    next();
  } else {
    // If Team Member is falsey, we can assume either the Team Member by that ID doesn't exist or the authenticated User doesn't have access
    res.status(404).json({ message: "Cannot find user with that ID" });
  }
}

function verifySlackID({ body: { teamMember } }, res, next) {
  if (teamMember.slack_uuid) {
    // If Team Member on request body has a Slack ID, call next
    next();
  } else {
    // If Team Member does not have Slack ID, end request
    res.status(400).json({
      message: "Cannot look up Slack history for a user without a Slack ID"
    });
  }
}
