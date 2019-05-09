const axios = require("axios");
const api = "https://slack.com/api";
const Tokens = require("../../../../models/db/tokens");

module.exports = async (n) => {
  const { auth_token } = await Tokens.find({ 'u.email': n.admin }).first();
  const channelID = await _openChannelWithUser(n.slack_uuid, auth_token);
  const msg = await _sendSlackMessage(channelID, n, auth_token);

  return { 
    ...n, 
    thread: channelID, 
    num_attempts: n.num_attempts + 1, 
    is_sent: true 
  } 
};

// Slack functions should be exported to their own file
// For universal universe
async function _openChannelWithUser(userID, token) {
  const endpoint = "/im.open";
  const url = `${api}${endpoint}?token=${token}&user=${userID}`;

  const dm = await axios.get(url);
  return dm.data.channel.id;
}

async function _sendSlackMessage(channelID, notification, token) {
  const endpoint = "/chat.postMessage";
  const message = _formatSlackMessage(notification);
  const url = `${api}${endpoint}?token=${token}&channel=${channelID}&text=${message}`;

  const data = await axios.get(url);
  return data;
}

function _formatSlackMessage({ first_name, subject, body, link }) {
  return `Hi ${first_name},\nI have the following message for you:\n\n*${subject}*\n${"```"}\n${body}\n${"```"}\n${
    link ? `>${link}` : ""
  }\n`;
}
