const db = require("../dbConfig.js");

module.exports = {
  getDailyTextNotifications,
  getDailyEmailNotifications,
  updateNotificationContent,
  updateNotificationMember,
  getNotificationByPostId,
  getTrainingSeriesOfNewPost,
  getUserNotificationCountData,
  increaseUserNotificationCount
};

function getDailyTextNotifications(day) {
  return db("Notifications")
    .select("phoneNumber", "postName", "postDetails", "link", "userID")
    .where({ sendDate: day });
}

function getDailyEmailNotifications(day) {
  return db("Notifications")
    .select("email", "postName", "postDetails", "link", "firstName", "lastName", "userID")
    .where({ sendDate: day });
}

function getNotificationByPostId(id) {
  return db("Notifications").where({ postID: id });
}

function updateNotificationContent(id, postContent) {
  // update post information on notification
  return db("Notifications")
    .where({ postID: id })
    .update(postContent);
  // update matching post with new date
  // if multiple team members in system, this will have to update all matching posts with new date
}

function updateNotificationMember(id, memberInformation) {
  return db("Notifications")
    .where({ teamMemberID: id })
    .update(memberInformation);
}

function getTrainingSeriesOfNewPost(id) {
  return db("Notifications")
    .select(
      "Notifications.teamMemberID",
      "Notifications.firstName",
      "Notifications.lastName",
      "Notifications.jobDescription",
      "Notifications.phoneNumber",
      "Notifications.email",
      "RelationalTable.startDate"
    )
    .join("RelationalTable", function() {
      this.on(
        "Notifications.teamMemberID",
        "RelationalTable.teamMember_ID"
      ).andOn(
        "Notifications.trainingSeriesID",
        "RelationalTable.trainingSeries_ID"
      );
    })
    .where({ trainingSeriesID: id })
    .groupBy("teamMemberID");
}

function getUserNotificationCountData(id) {
  return db("User")
    .select("User.notificationCount", "accountType.maxNotificationCount")
    .join("accountType", "User.accountTypeID", "accountType.accountTypeID")
    .where({userID: id})
    .first();
}

function increaseUserNotificationCount(id, count) {
  return db("User").where({userID: id}).update({notificationCount: count});
}
/* 
Pseudocode for increasing user's notification count, and resetting it at the beginning of every month

When a notification is sent through the notification system, User.notificationCount needs to increase
We need to be able to dynamically update each user based on their ID, and increase count by 1 per notification (1 for email, 1 for text)
Every time a notification is sent, we need to compare User.notificationCount and accountType.maxNotificationCount based on the user's account type
If User.notificationCount < accountType.maxNotificationCount, notifications can still be sent
If equal or greater than, notifications must stop and a message must be sent to the front end and restrict the endpoint on the backend

Also, User.notificationCount must reset to 0 on the first of every month
(New cron job to say if day = 1, reset count)
*/
