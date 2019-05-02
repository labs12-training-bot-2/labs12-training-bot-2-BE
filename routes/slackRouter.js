// We inherited a poor file structure so we're following it for now.
// Sections I intend to eventually abstract out, I will write with /* */ comments

// This file handles all the Slack API endpoints
const router = require("express").Router();
const axios = require("axios");

const Team = require("../database/Helpers/teamMember-model.js");

// ****** proces.env.SLACK_TOKEN works locally.  Should be in DB eventually
const token = process.env.SLACK_TOKEN;
// ******

const api = "https://slack.com/api";

// **** Temporary import to test a test endpoint
const sendSlackNotifications = require("../notificationSystem/sendSlackNotifications");
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

router.get("/users", async (req, res) => {
  // Test route
  try {
    const users = await Team.find();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Couldn't get team members" });
  }
});

router.put(
  "/add/:id",
  verifyAddInput,
  async ({ body: { id, slack_id, slack_on } }, res) => {
    try {
      const teamMember = await Team.findBy({ id }).first();
      teamMember.slack_id = slack_id;
      teamMember.slack_on = slack_on ? true : false;

      const updated = await Team.update(teamMember.id, teamMember);
      updated
        ? res.status(200).json(teamMember)
        : res.status(500).json({ message: "The user was not updated" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal error adding Slack ID" });
    }
  }
);

router.put("/toggle/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const teamMember = await Team.findBy({ id }).first();
    if (teamMember.slack_id && teamMember.slack_id !== "pending slack ID") {
      teamMember.slack_on = !teamMember.slack_on;
      const updated = await Team.update(teamMember.id, teamMember);

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
        : res.status(500).json({ message: "Message did not send" });
    } else {
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal error sending Message" });
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
