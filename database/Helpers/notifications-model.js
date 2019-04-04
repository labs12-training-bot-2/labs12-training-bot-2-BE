const db = require('../dbConfig.js');

module.exports = {
  getDailyTextNotifications,
  getDailyEmailNotifications,
  updateNotificationContent,
  updateNotificationMember,
  getNotificationByPostId,
  getTrainingSeriesOfNewPost,
  getUserNotificationCountData,
  increaseUserNotificationCount,
  asyncForEach,
  resetNotificationCount
};

function getDailyTextNotifications(day) {
  return db('Notifications')
    .select('phoneNumber', 'postName', 'postDetails', 'link', 'userID')
    .where({ sendDate: day });
}

function getDailyEmailNotifications(day) {
  return db('Notifications')
    .select(
      'email',
      'postName',
      'postDetails',
      'link',
      'firstName',
      'lastName',
      'userID'
    )
    .where({ sendDate: day });
}

function getNotificationByPostId(id) {
  return db('Notifications').where({ postID: id });
}

function updateNotificationContent(id, postContent) {
  return db('Notifications')
    .where({ postID: id })
    .update(postContent);
}

function updateNotificationMember(id, memberInformation) {
  return db('Notifications')
    .where({ teamMemberID: id })
    .update(memberInformation);
}

function getTrainingSeriesOfNewPost(id) {
  return db('Notifications')
    .select(
      'Notifications.teamMemberID',
      'Notifications.firstName',
      'Notifications.lastName',
      'Notifications.jobDescription',
      'Notifications.phoneNumber',
      'Notifications.email',
      'RelationalTable.startDate'
    )
    .join('RelationalTable', function() {
      this.on(
        'Notifications.teamMemberID',
        'RelationalTable.teamMember_ID'
      ).andOn(
        'Notifications.trainingSeriesID',
        'RelationalTable.trainingSeries_ID'
      );
    })
    .where({ trainingSeriesID: id })
    .groupBy('teamMemberID');
}

function getUserNotificationCountData(id) {
  return db('User')
    .select(
      'User.notificationCount',
      'accountType.maxNotificationCount',
      'User.userID'
    )
    .join('accountType', 'User.accountTypeID', 'accountType.accountTypeID')
    .where({ userID: id })
    .first();
}

function increaseUserNotificationCount(id, count) {
  return db('User')
    .where({ userID: id })
    .update({ notificationCount: count });
}

// async function mimicking a forEach
async function asyncForEach(notifications, callback) {
  for (let i = 0; i < notifications.length; i++) {
    await callback(notifications[i]);
  }
}

// reset notification count at first of month for all users.
function resetNotificationCount() {
  return db('User')
    .where('notificationCount', '>', 0)
    .update({ notificationCount: 0 });
}
