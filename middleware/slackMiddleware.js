// Models
const Tokens = require("../models/db/tokens");
const TeamMembers = require("../models/db/teamMembers");

module.exports = {
  getSlackToken,
  verifyHistoryID,
  verifySlackID
};

async function getSlackToken(req, res, next) {
  const { email } = res.locals.user;
  const token = await Tokens.find({
    "u.email": email,
    "s.name": "slack"
  }).first();
  if (token) {
    res.locals.user.token = token.auth_token;
    next();
  } else {
    res
      .status(404)
      .json({ error: "Failed to retrieve Slack token from storage" });
  }
}

async function verifyHistoryID(req, res, next) {
  const { email } = res.locals.user;

  const {
    params: { id }
  } = req;
  const teamMember = await TeamMembers.find({
    "tm.id": id,
    "u.email": email
  }).first();
  if (teamMember) {
    req.body.teamMember = teamMember;
    next();
  } else {
    res.status(404).json({ message: "Cannot find user with that ID" });
  }
}

function verifySlackID({ body: { teamMember } }, res, next) {
  // Could expand to add middleware that queries Slack API
  // and verifies the ID is valid
  if (teamMember.slack_uuid) {
    next();
  } else {
    res.status(400).json({
      message: "Cannot look up Slack history for a user without a Slack ID"
    });
  }
}
