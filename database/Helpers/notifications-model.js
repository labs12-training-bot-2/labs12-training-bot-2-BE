const db = require('../dbConfig.js');

module.exports = {
	getTextNotifications,
	getEmailNotifications,
	getDailyTextNotifications,
	getDailyEmailNotifications,
	getSlackNotifications,
	updateNotificationContent,
	updateNotificationMember,
	markNotificationAsSent,
	getNotificationByMessageId,
	getNotificationsToRecalculate,
	getTrainingSeriesAssignmentsOfNewMessage,
	getUserNotificationCountData,
	increaseUserNotificationCount,
	asyncForEach,
	resetNotificationCount,
	deleteOldNotifications
};

function getTextNotifications(id) {
	return db('notifications AS n')
		.join('training_series AS t', 'n.training_series_id', 't.id')
		.select('n.*', 't.title', 't.id AS training_series_id')
		.where('n.user_id', id);
}

function getEmailNotifications(id) {
	return db('notifications AS n')
		.join('training_series AS t', 'n.training_series_id', 't.id')
		.select('n.*', 't.title', 't.id AS training_series_id')
		.where('n.user_id', id);
}
function getSlackNotifications(id) {
	return db('notifications AS n')
		.join('training_series AS t', 'n.training_series_id', 't.id')
		.select(
			'n.slack_id',
			'n.message_name',
			'n.message_details',
			'n.link',
			'n.first_name',
			'n.last_name',
			'n.user_id',
			'n.send_date',
			'n.slack_sent',
			't.title',
			't.id'
		)
		.where('n.user_id', id);
}

function getDailyTextNotifications(day) {
	return db('notifications')
		.select('phone_number', 'message_name', 'message_details', 'link', 'user_id', 'text_sent', 'text_on', 'id')
		.where({ send_date: day });
}

function getDailyEmailNotifications(day) {
	return db('notifications')
		.select(
			'email',
			'message_name',
			'message_details',
			'link',
			'first_name',
			'last_name',
			'user_id',
			'email_sent',
			'email_on',
			'id'
		)
		.where({ send_date: day });
}

function getNotificationByMessageId(id) {
	return db('notifications').where({ message_id: id });
}

function getNotificationsToRecalculate(message_id, team_member_id) {
	return db('notifications')
		.join('relational_table AS r', 'r.team_member_id', team_member_id)
		.select('notifications.*', 'r.start_date')
		.where({ message_id });
}

function updateNotificationContent(id, content) {
	return db('notifications').where({ id }).update(content);
}

function updateNotificationMember(id, memberInformation) {
	return db('notifications').where({ team_member_id: id }).update(memberInformation);
}

function markNotificationAsSent(id, content) {
	return db('notifications').where({ id }).update(content);
}

function getTrainingSeriesAssignmentsOfNewMessage(id) {
	return db('training_series AS ts')
		.join('relational_table AS r', 'ts.id', 'r.training_series_id')
		.join('team_members AS t', 't.id', 'r.team_member_id')
		.select(
			't.id',
			't.first_name',
			't.last_name',
			't.job_description',
			't.phone_number',
			't.email',
			'r.start_date',
			't.user_id',
			't.email_on',
			't.text_on'
		)
		.where('r.training_series_id', id);
}

function getUserNotificationCountData(id) {
	return db('users')
		.select('users.notification_count', 'account_types.max_notification_count', 'users.id')
		.join('account_types', 'users.account_type_id', 'account_type.id')
		.where({ id })
		.first();
}

function increaseUserNotificationCount(id, count) {
	return db('users').where({ id }).update({ notification_count: count });
}

// async function mimicking a forEach
async function asyncForEach(notifications, callback) {
	try {
		for (let i = 0; i < notifications.length; i++) {
			await callback(notifications[i]);
		}
	} catch (error) {
		console.log('async for each function error', error);
	}
}

// reset notification count at first of month for all users.
function resetNotificationCount() {
	return db('users').where('notification_count', '>', 0).update({ notification_count: 0 });
}

function deleteOldNotifications(today) {
	return db('notifications').where('send_date', '<', today).del();
}
