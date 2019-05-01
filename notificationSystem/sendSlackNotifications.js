const axios = require('axios');
// ***** Temp local code, should pull from DB
const token = process.env.SLACK_TOKEN;
// *****

const api = 'https://slack.com/api';

async function sendSlackNotifications(notification) {
	const channelID = await _openChannelWithUser(notification.slack_id);
	const msg = _sendSlackMessage(channelID, notification.message_details);
}

async function _openChannelWithUser(userID) {
	const endpoint = '/im.open';
	const url = `${api}${endpoint}?token=${token}&user=${userID}`;

	const dm = await axios.get(url);
	return dm.data.channel.id;
}

async function _sendSlackMessage(channelID, message) {
	const endpoint = '/chat.postMessage';
	const url = `${api}${endpoint}?token=${token}&channel=${channelID}&text=${message}`;

	await axios.get(url);
}
