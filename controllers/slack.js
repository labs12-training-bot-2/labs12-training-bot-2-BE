// Sections I intend to eventually abstract out, I will write with /* */ comments
const router = require("express").Router();
const axios = require("axios");

const Teams = require("../models/db/teamMembers.js");
const Messages = require("../models/db/messages.js");
const Notifications = require("../models/db/notifications.js");
const Tokens = require("../models/db/tokens.js");
const sendSlackNotifications = require("../jobs/notifications/lib/senders/slack");

const api = "https://slack.com/api";

router.post("/oauth/", async ({ body: { code } }, res) => {
  console.log("Did we get here,oath?");
  const query = `client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${
    process.env.SLACK_SECRET
  }&code=${code}&redirect_uri=${process.env.APP_BASE_URL}/slack-callback`;
  const url = `https://slack.com/api/oauth.access?${query}`;

  const auth_res = await axios.get(url);
  console.log(res.locals.user);
  console.log("TOKEN", auth_res.data.bot.bot_access_token);
  const { id } = res.locals.user;
  const token = {
    user_id: id,
    service: "slack",
    auth_token: auth_res.data.bot.bot_access_token
  };
  console.log("TOKEN", token);
  const savedToken = await Tokens.add(token);
  savedToken ? res.status(201).end() : res.status(500).end();
});

router.get("/", getSlackToken, async (req, res) => {
  // Get every user from Slack workspace
  const { token } = res.locals.user;
  const userlist = await getAllUsers(token);
  res.status(200).json(userlist);
});

router.put(
  "/:id/add",
  getSlackToken,
  verifyAddInput,
  async ({ body: { id, slack_uuid } }, res) => {
    // If you wanted to add a Slack ID you could use this endpoint but currently
    // we just use the TeamMember endpoints for that
    const teamMember = await Teams.findBy({ id }).first();
    teamMember.slack_uuid = slack_uuid;

    const updated = await Teams.update(teamMember.id, teamMember);
    updated
      ? res.status(200).json(teamMember)
      : res.status(500).json({ message: "The user was not updated" });
  }
);

router.get(
  "/:id/history",
  verifyHistoryID,
  verifySlackID,
  getSlackToken,
  async ({ body: { teamMember } }, res) => {
    // Get DM chat history
    const { token } = res.locals.user;
    const { slack_uuid } = teamMember;
    const endpoint = "/conversations.history";
    const channelID = await _openChannelWithUser(slack_uuid);
    const url = `${api + endpoint}?token=${token}&channel=${channelID}`;

    const history = await axios.get(url);
    res.status(200).json(history.data.messages);
  }
);

router.post(
  "/sendMessageNow",
  getSlackToken,
  async ({ body: { notification } }, res) => {
    // Skip the timed notification system and send message right away
    const { first_name, subject, body, slack_uuid } = notification;
    const { token } = res.locals.user;
    if ((first_name && subject && body, slack_uuid)) {
      const newMsg = {
        subject,
        body,
        training_series_id: 1,
        days_from_start: 1
      };
      const returnedMsg = await Messages.add(newMsg);
      const newNotif = {
        send_date: new Date(),
        is_sent: false,
        num_attempts: 0,
        thread: "",
        message_id: returnedMsg.id,
        service_id: 3,
        team_member_id: notification.team_member_id
      };
      const returnedNotif = await Notifications.add(newNotif);
      const msg = await sendSlackNotifications(returnedNotif);
      if (msg) {
        const updatedNotif = await Notifications.update(
          { "n.id": msg.id },
          msg
        );
        res.status(200).end();
      } else {
        res.status(500).json({ message: "Message did not send" });
      }
    } else {
      res.status(400).json({
        message: "Please include first_name, subject, body, and slack_uuid"
      });
    }
  }
);

module.exports = router;

/* 
Slack API Helpers
*/
async function getAllUsers(token) {
  const endpoint = "/users.list";
  const url = `${api + endpoint}?token=${token}`;

  const list = await axios.get(url);
  return list.data.members.map(
    ({ id, name, profile: { real_name, display_name, image_24 } }) => ({
      id,
      real_name,
      username: name,
      display_name,
      image_24
    })
  );
}

/*
MIDDLEWARE
*/
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
function verifyAddInput(req, res, next) {
  const { body, params } = req;
  const { slack_uuid } = body;
  if (slack_uuid) {
    body.id = params.id;
    next();
  } else {
    res
      .status(400)
      .json({ message: "Please include the team member's id and slack_uuid" });
  }
}

async function verifyHistoryID(req, res, next) {
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

// Copy/Paste from sendSlackNotifications.js
// Slack functions need to be exported to their own file
async function _openChannelWithUser(userID) {
  const endpoint = "/im.open";
  const url = `${api}${endpoint}?token=${token}&user=${userID}`;

  const dm = await axios.get(url);
  return dm.data.channel.id;
}
