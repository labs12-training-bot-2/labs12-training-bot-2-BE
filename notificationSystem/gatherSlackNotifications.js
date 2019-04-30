// dependencies
const moment = require('moment');

// function imports
const { getDailySlackNotifications, asyncForEach } = require('../database/Helpers/notifications-model');

const sendSlackNotifications = require('./sendSlackNotification'); // write with sendgrid function

// format moment variable for query
const today = moment().format('YYYY-MM-D');

// query DB and get data from notification table
// pass into sendNotifications which posts to twilio API
const gatherSlackNotification = () => {
	return {
		run: async () => {
			const notifications = await getDailySlackNotifications(today);
			if (notifications.length === 0) {
				console.log('No Slack notifications from today.');
			} else {
				await asyncForEach(notifications, sendSlackNotifications);
			}
		}
	};
};

module.exports = gatherSlackNotification();
