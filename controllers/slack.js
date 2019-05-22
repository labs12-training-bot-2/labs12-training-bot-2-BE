// Dependencies
const router = require("express").Router();
const axios = require("axios");

// Models
const Messages = require("../models/db/messages.js");
const Notifications = require("../models/db/notifications.js");
const Tokens = require("../models/db/tokens.js");
const sendSlackNotifications = require("../jobs/notifications/lib/senders/slack");

// Helpers
const { _openChannelWithUser } = require("../helpers/slackHelpers");

// Middleware
const {
  getSlackToken,
  verifyHistoryID,
  verifySlackID
} = require("../middleware/slackMiddleware");

// Local Variables
const api = "https://slack.com/api";

router.post("/oauth/", async ({ body: { code } }, res) => {
  /**
   * Creates authenticated Slack Token in the database after oauth validation
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Build query string from Slack environment variables and the APP_BASE_URL as the redirect URI
  const query = `client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${
    process.env.SLACK_SECRET
  }&code=${code}&redirect_uri=${process.env.APP_BASE_URL}/slack-callback`;

  // Build url to request oauth token out of query string
  const url = `https://slack.com/api/oauth.access?${query}`;

  // Send GET request to built URL string
  const auth_res = await axios.get(url);

  // Destructure User ID from the User stored on res.locals
  const { id } = res.locals.user;

  // Build Slack Token from User ID and the bot access token returned by a successful oauth query
  const token = {
    user_id: id,
    service: "slack",
    auth_token: auth_res.data.bot.bot_access_token
  };

  // Add new Token to the database
  await Tokens.add(token);

  // Return No Content status to the client since the new Token should be stored but not returned
  res.status(204).end();
});

router.get("/", getSlackToken, async (req, res) => {
  /**
   * Validates that authenticated User has valid Slack Token in database and adds it res.locals.user,
   * then gets all Slack users from the authenticated workspace
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructure Token from user object on res.locals
  const { token } = res.locals.user;

  // Build request url with the Token
  const url = `${api}/users.list?token=${token}`;

  // Make GET request to built url to retrieve the list of Slack users
  const list = await axios.get(url);

  // Build new array from retrieved list of Slack users in format the Front End will expect
  const userList = list.data.members.map(
    ({ id, name, profile: { real_name, display_name, image_24 } }) => ({
      id,
      real_name,
      username: name,
      display_name,
      image_24
    })
  );

  // Return array of reformatted Slack users from authenticated workspace to the client
  res.status(200).json(userList);
});

router.get(
  "/:id/history",
  verifyHistoryID,
  verifySlackID,
  getSlackToken,
  async ({ body: { teamMember } }, res) => {
    /**
     * Validates that authenticated User has valid Slack Token in database and adds it res.locals.user,
     * validates that Slack channel's ID matches against existing Team Member and adds that Team Member to request body,
     * validates that Team Member added to request body has a slack_uuid,
     * then gets all messages in specific DM chat history log for specified Team Member
     *
     * Currently not used in app, but would be vital if future version required the retrieval of a DM channel History
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destruture Token from the authenticated User on res.locals
    const { token } = res.locals.user;

    // Destructure slack_uuid from request body's Team Member
    const { slack_uuid } = teamMember;

    // Specify endpoint to be used to build request URL string
    const endpoint = "/conversations.history";

    // Open a DM channel between our Slack bot and a given Team Member and returns the Channel ID
    const channelID = await _openChannelWithUser(api, slack_uuid, token);

    // Build request URL
    const url = `${api + endpoint}?token=${token}&channel=${channelID}`;

    // Use built request URL to retrieve DM channel History
    const history = await axios.get(url);

    // Return all Messages from retrieved DM channel History to client
    res.status(200).json(history.data.messages);
  }
);

router.post(
  "/sendMessageNow",
  getSlackToken,
  async ({ body: { notification } }, res) => {
    /**
     * Validates that authenticated User has valid Slack Token in database and adds it res.locals.user,
     * then immediately sends Slack Message to specified Team Member
     *
     * Not desired in production version of app, but vital to instant testing of Slack messaging feature
     *
     * The Notification included with the request body is manually verified for a bad form case (400) as
     * opposed to using Joi validation middleware like seen elsewhere in the server since it is a nested
     * object and not the only contents of the request body
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure required fields from Notification on request body
    const { first_name, subject, body, slack_uuid } = notification;

    // Destructure Token from authenticated User on res.locals
    const { token } = res.locals.user;

    // Validate proper form of Notification
    if ((first_name && subject && body, slack_uuid)) {
      // Build new Message from properties of Notification and request body, with hard-coded Training Series ID
      const newMsg = {
        subject,
        body,
        training_series_id: 1,
        days_from_start: 1
      };

      // Add new Message to database
      const returnedMsg = await Messages.add(newMsg);

      // Build new Notification with newly created Message's ID
      const newNotif = {
        send_date: new Date(),
        is_sent: false,
        num_attempts: 0,
        thread: "",
        message_id: returnedMsg.id,
        service_id: 3,
        team_member_id: notification.team_member_id
      };

      // Add new Notification to the database
      const returnedNotif = await Notifications.add(newNotif);

      // Attempt to send Slack Notification
      const msg = await sendSlackNotifications(returnedNotif);

      // Update the Notification in the database with the retrieved Notification's ID
      await Notifications.update({ "n.id": msg.id }, msg);

      // No content to be sent back to client
      res.status(204).end();
    } else {
      // If Notification on request body did not have proper form, return 400 message to client
      res.status(400).json({
        message: "Please include first_name, subject, body, and slack_uuid"
      });
    }
  }
);

module.exports = router;
