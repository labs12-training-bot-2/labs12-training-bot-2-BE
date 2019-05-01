// Gather all Slack notifications ready to be sent from the database and then send them
const moment = require('moment');

const { getDailySlackNotifications, asyncForEach } = require('../database/Helpers/notifications-model');
const sendSlackNotifications = require('./sendSlackNotification');

const today = moment().format('YYYY-MM-D');

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
