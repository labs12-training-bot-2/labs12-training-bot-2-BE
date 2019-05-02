const axios = require("axios");
// ***** Temp local code, should pull from DB
const token = process.env.SLACK_TOKEN;
// *****

const api = "https://slack.com/api";

module.exports = sendSlackNotifications;

async function sendSlackNotifications(notification) {
  const channelID = await _openChannelWithUser(notification.slack_id);
  const msg = await _sendSlackMessage(channelID, notification);

  if (msg) {
    Notifications.markNotificationAsSent(notification.id, { slack_sent: true });
  }
}

// Slack functions should be exported to their own file
// For universal universe

async function _openChannelWithUser(userID) {
  const endpoint = "/im.open";
  const url = `${api}${endpoint}?token=${token}&user=${userID}`;

  const dm = await axios.get(url);
  return dm.data.channel.id;
}

async function _sendSlackMessage(channelID, notification) {
  const endpoint = "/chat.postMessage";
  const message = _formatSlackMessage(notification);
  const url = `${api}${endpoint}?token=${token}&channel=${channelID}&text=${message}`;

  await axios.get(url);
}

function _formatSlackMessage({
  first_name,
  message_name,
  message_details,
  link
}) {
  return `Hi ${first_name},\nI have the following message for you:\n\n*${message_name}*\n${"```"}\n${message_details}\n${"```"}\n${
    link ? `>${link}` : ""
  }\n`;
}
