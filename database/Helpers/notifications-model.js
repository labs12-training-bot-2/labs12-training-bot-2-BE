const db = require('../dbConfig.js');

module.exports = {
  getDailyTextNotifications,
  getDailyEmailNotifications
};

function getDailyTextNotifications(day) {
  return db('Notifications')
    .select('phoneNumber', 'postName', 'postDetails', 'link')
    .where({ sendDate: day });
}

function getDailyEmailNotifications(day) {
  return db('Notifications')
    .select('email', 'postName', 'postDetails', 'link', 'firstName', 'lastName')
    .where({ sendDate: day });
}

function updateNotifications() {
  // user updates sendDate on a post
  // update matching post with new date
  // if multiple team members in system, this will have to update all matching posts with new date
}

function deleteNotification() {
  // when user deletes a post
  // delete matching posts from notification table
}

function addToExistingTrainingSeries() {
  // when user adds a post to an existing training series with assigned team members
  // add post to notification table for each user
}
