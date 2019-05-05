// We inherited a poor file structure so we're following it for now.
// Sections I intend to eventually abstract out, I will write with /* */ comments

// This file handles all the Slack API endpoints
const router = require("express").Router();
const axios = require("axios");

const Team = require("../models/db/teamMembers");

// ****** proces.env.SLACK_TOKEN works locally.  Should be in DB eventually
const token = process.env.SLACK_TOKEN;
// ******

const api = "https://slack.com/api";

// **** Temporary import to test a test endpoint
const sendSlackNotifications = require("../jobs/notifications/send/slack");
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
  "/add/:user_id",
  verifyAddInput,
  async ({ body: { user_id, slack_id } }, res) => {
    try {
      const teamMember = await Team.findBy({ user_id });
      teamMember.slack_id = slack_id;

      const updated = await Team.update(id, teamMember);
      updated
        ? res.status(200).json(updated)
        : res.status(500).json({ message: "The user was not updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal error adding Slack ID" });
    }
  }
);

router.post("/sendMsgMeow", ({ body: { notification } }, res) => {
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
        : res.status(500).json({ message: "Message did not sent" });
    } else {
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal error sending msg" });
  }
});

module.exports = router;

/* 
Slack API Helpers
*/
async function getAllUsers() {
  try {
    const endpoint = "/users.list";
    const url = `${api}${endpoint}?token=${token}`;

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
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal error getting all users" });
  }
}

/*
MIDDLEWARE
*/
function verifyAddInput({ body: { slack_id }, params }, res, next) {
  if (slack_id) {
    body.user_id = params.user_id;
    next();
  } else {
    res
      .status(400)
      .json({ message: "Please include the user_id and slack_id" });
  }
}
