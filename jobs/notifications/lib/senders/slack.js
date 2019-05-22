const axios = require("axios");
const api = "https://slack.com/api";
const Tokens = require("../../../../models/db/tokens");
const { _openChannelWithUser } = require("../../../../helpers/slackHelpers");

/**
 * Takes a Notification object (n) and attempts to send it to the appropriate
 * Team Member via Slack
 *
 * Purposefully doesn't attempt to catch errors so that errors bubble up to the function that calls it.
 *
 * @param {Object} n - A Notification object
 * @return {Object} - An updated Notification object
 */

module.exports = async n => {
  // Get the slack auth_token associated with
  const { auth_token } = await Tokens.find({ "u.email": n.user }).first();

  // Wait for a channel to be opened with the User
  const channelID = await _openChannelWithUser(api, n.slack_uuid, auth_token);

  // Wait for the message to send
  await _sendSlackMessage(channelID, n, auth_token);

  // return an updated Notification object that sets thread to the ChannelID,
  // increments num_attempts, and changes is_sent to true
  return {
    id: n.id,
    thread: channelID,
    num_attempts: n.num_attempts + 1,
    is_sent: true
  };
};

/**
 * Sends a Slack message from our Slack bot to a given Team Member
 *
 * @param {String} channelID - The unique ID of the open channel between our Bot and the Team Member
 * @param {Object} notification - A Notification object
 * @param {String} token -
 *
 * @return {Object} The data returned by the Axios call to Slack
 */
async function _sendSlackMessage(channelID, notification, token) {
  const endpoint = "/chat.postMessage";
  const message = _formatSlackMessage(notification);
  const url = `${api}${endpoint}?token=${token}&channel=${channelID}&text=${message}`;

  const data = await axios.get(url);
  return data;
}

/**
 * Formats a Notification object to fit Slack's pseudo-Markdown syntax
 *
 * @param {Object} n - A Notification Object
 * @param {String} n.first_name - The Team Member's first name
 * @param {String} n.subject - The subject of the Notification
 * @param {String} n.body - the body of the Notification
 * @param {String} [n.link] - (Optional) A link to a resource associated with the Notification
 */
function _formatSlackMessage({ first_name, subject, body, link }) {
  return `Hi ${first_name},\nI have the following message for you:\n\n*${subject}*\n${"```"}\n${body}\n${"```"}\n${
    link ? `>${link}` : ""
  }\n`;
}
