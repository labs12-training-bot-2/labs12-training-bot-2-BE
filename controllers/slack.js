// We inherited a poor file structure so we're following it for now.
// Sections I intend to eventually abstract out, I will write with /* */ comments

// This file handles all the Slack API endpoints
const router = require("express").Router();
const axios = require("axios");

const Teams = require("../models/db/teamMembers.js");
const Tokens = require("../models/db/tokens.js");

// ****** proces.env.SLACK_TOKEN works locally.  Should be in DB eventually
const token = process.env.SLACK_TOKEN;
// ******

const api = "https://slack.com/api";

// **** Temporary import to test a test endpoint
const sendSlackNotifications = require("../jobs/notifications/lib/senders/slack");
// ****

router.get("/", async (req, res) => {
  // Useful route for frontend to autocomplete values
  try {
    const userlist = await getAllUsers();
    res.status(200).json(userlist);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal server error fetching Slack users" });
  }
});

router.put(
  "/:id/add",
  verifyAddInput,
  async ({ body: { id, slack_id, slack_on } }, res) => {
    try {
      const teamMember = await Teams.findBy({ id }).first();
      teamMember.slack_id = slack_id;
      teamMember.slack_on = slack_on ? true : false;

      const updated = await Teams.update(teamMember.id, teamMember);
      updated
        ? res.status(200).json(teamMember)
        : res.status(500).json({ message: "The user was not updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal error adding Slack ID" });
    }
  }
);

router.get(
  "/:id/history",
  verifyHistoryID,
  verifySlackID,
  async ({ body: { teamMember } }, res) => {
    const { slack_id } = teamMember;
    try {
      const endpoint = "/conversations.history";
      const channelID = await _openChannelWithUser(slack_id);
      const url = `${api + endpoint}?token=${token}&channel=${channelID}`;

      const history = await axios.get(url);
      res.status(200).json(history.data.messages);
    } catch (err) {
      console.log("ERROR", err);
      res
        .status(500)
        .json({ message: "Internal error getting Slack message history" });
    }
  }
);

router.post("/oauth/", async ({ body: { code } }, res) => {
  const query = `client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${
    process.env.SLACK_SECRET
  }&code=${code}&redirect_uri=${process.env.APP_BASE_URL}/slack-callback`;
  const url = `https://slack.com/api/oauth.access?${query}`;

  const auth_res = await axios.get(url);
  const { id } = res.locals.user;
  const token = {
    user_id: id,
    service: "slack",
    auth_token: auth_res.data.bot.bot_access_token
  };

  await Tokens.add(token);
});

router.put("/:id/toggle", async (req, res) => {
  const { id } = req.params;
  try {
    const teamMember = await Teams.findBy({ id }).first();
    if (teamMember.slack_id && teamMember.slack_id !== "pending slack ID") {
      teamMember.slack_on = !teamMember.slack_on;
      const updated = await Teams.update(teamMember.id, teamMember);

      updated
        ? res.status(200).json(teamMember)
        : res.status(500).json({
            message: "The team member's slack preference was not updated."
          });
    } else {
      res.status(400).json({ message: "Cannot toggle Slack without an ID" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal error toggling user's slack preference" });
  }
});

router.post("/sendMessageNow", ({ body: { notification } }, res) => {
  // Test Route Please Ignore
  try {
    const {
      first_name,
      message_name,
      message_details,
      slack_id
    } = notification;
    if ((first_name && message_name && message_details, slack_id)) {
      const msg = sendSlackNotifications(notification);
      msg
        ? res.status(200).json({ message: "Message sent" })
        : res.status(500).json({ message: "Message did not send" });
    } else {
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal error sending Message" });
  }
});

router.get("/users", async (req, res) => {
  // Test route
  try {
    const users = await Teams.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Couldn't get team members" });
  }
});
module.exports = router;

/* 
Slack API Helpers
*/
async function getAllUsers() {
  try {
    const endpoint = "/users.list";
    const url = `${api + endpoint}?token=${token}`;
    console.log(url);

    const list = await axios.get(url);
    console.log(list);
    return list.data.members.map(
      ({ id, name, profile: { real_name, display_name, image_24 } }) => ({
        id,
        real_name,
        username: name,
        display_name,
        image_24
      })
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal error getting all users" });
  }
}

/*
MIDDLEWARE
*/
function verifyAddInput(req, res, next) {
  const { body, params } = req;
  const { slack_id } = body;
  if (slack_id) {
    body.id = params.id;
    next();
  } else {
    res
      .status(400)
      .json({ message: "Please include the team member's id and slack_id" });
  }
}

async function verifyHistoryID(req, res, next) {
  try {
    const {
      params: { id }
    } = req;
    const teamMember = await Teams.findById(id);
    if (teamMember) {
      req.body.teamMember = teamMember;
      next();
    } else {
      res.status(404).json({ message: "Cannot find user with that ID" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal error looking up team member" });
  }
}

function verifySlackID({ body: { teamMember } }, res, next) {
  // Could expand to add middleware that queries Slack API
  // and verifies the ID is valid
  if (teamMember.slack_id) {
    next();
  } else {
    res.status(400).json({
      message: "Cannot look up Slack history for a user without a Slack ID"
    });
  }
}

function verifyAuthInput({ body: { client_id, secret } }, res, next) {
  if (client_id && secret) {
    next();
  } else {
    res
      .status(400)
      .json({ message: "client_id & secret are required to authorize Slack" });
  }
}

// Copy/Paste from sendSlackNotifications.js
// Slack functions need to be exported to their own file
async function _openChannelWithUser(userID) {
  const endpoint = "/im.open";
  const url = `${api}${endpoint}?token=${token}&user=${userID}`;

  const dm = await axios.get(url);
  return dm.data.channel.id;
}

/*
	  Missing scope error:
	  data:
   { ok: false,
     error: 'missing_scope',
     needed: 'channels:history',
	 provided: 'identify,bot:basic' } }
	 */
