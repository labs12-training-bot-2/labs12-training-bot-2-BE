const axios = require("axios");

module.exports = {
  _openChannelWithUser
};

/**
 * Opens a direct message channel between our Slack bot and a given Team Member
 *
 * @param {String} api - A base API URL for accessing Slack endpoints
 * @param {String} userID - A Team Member's slack_uuid
 * @param {String} token - A User's Slack token
 *
 * @return {String} The ID of the direct message channel that was opened between our bot and the Team Member
 */
async function _openChannelWithUser(api, userID, token) {
  const endpoint = "/im.open";
  const url = `${api}${endpoint}?token=${token}&user=${userID}`;

  const dm = await axios.get(url);
  return dm.data.channel.id;
}
