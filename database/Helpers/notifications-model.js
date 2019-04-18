const db = require("../dbConfig.js");

module.exports = {
  getTextNotifications,
  getEmailNotifications,
  getDailyTextNotifications,
  getDailyEmailNotifications,
  updateNotificationContent,
  updateNotificationMember,
  markNotificationAsSent,
  getNotificationByPostId,
  getNotificationsToRecalculate,
  getTrainingSeriesOfNewPost,
  getUserNotificationCountData,
  increaseUserNotificationCount,
  asyncForEach,
  resetNotificationCount,
  deleteOldNotifications,
};

function getTextNotifications(id) {
  return db("Notifications as n")
    .join("TrainingSeries as t", "n.trainingSeriesID", "t.trainingSeriesID")
    .select(
      "n.phoneNumber",
      "n.postName",
      "n.postDetails",
      "n.link",
      "n.userID",
      "n.sendDate",
      "n.firstName",
      "n.lastName",
      "n.textSent",
      "t.title",
      "t.trainingSeriesID"
    )
    .where("n.userID", id);
}

function getEmailNotifications(id) {
  return db("Notifications as n")
    .join("TrainingSeries as t", "n.trainingSeriesID", "t.trainingSeriesID")
    .select(
      "n.email",
      "n.postName",
      "n.postDetails",
      "n.link",
      "n.firstName",
      "n.lastName",
      "n.userID",
      "n.sendDate",
      "n.emailSent",
      "t.title",
      "t.trainingSeriesID"
    )
    .where("n.userID", id);
}

function getDailyTextNotifications(day) {
  return db("Notifications")
    .select(
      "phoneNumber",
      "postName",
      "postDetails",
      "link",
      "userID",
      "textSent",
      "textOn",
      "notificationID"
    )
    .where({ sendDate: day });
}

function getDailyEmailNotifications(day) {
  return db("Notifications")
    .select(
      "email",
      "postName",
      "postDetails",
      "link",
      "firstName",
      "lastName",
      "userID",
      "emailSent",
      "emailOn",
      "notificationID",
    )
    .where({ sendDate: day });
}

function getNotificationByPostId(id) {
  return db("Notifications").where({ postID: id });
}

function getNotificationsToRecalculate(postID, teamMemberID) {
  return db("Notifications")
    .join("RelationalTable", "RelationalTable.teamMember_ID", teamMemberID)
    .select(
      "Notifications.*",
      "RelationalTable.startDate",
    )
    .where({ postID: postID })
}

function updateNotificationContent(id, content) {
  return db("Notifications")
    .where({ notificationID: id })
    .update(content);
}

function updateNotificationMember(id, memberInformation) {
  return db("Notifications")
    .where({ teamMemberID: id })
    .update(memberInformation);
}

function markNotificationAsSent(id, content) {
  return db("Notifications")
    .where({ notificationID: id })
    .update(content);
}

function getTrainingSeriesOfNewPost(id) {
  return db("TeamMember")
    .select(
      "TeamMember.teamMemberID",
      "TeamMember.firstName",
      "TeamMember.lastName",
      "TeamMember.jobDescription",
      "TeamMember.phoneNumber",
      "TeamMember.email",
      "RelationalTable.startDate",
      "TeamMember.userID",
      "TeamMember.emailOn",
      "TeamMember.textOn"
    )
    .join("RelationalTable", function () {
      this.on("TeamMember.teamMemberID", "RelationalTable.teamMember_ID");
    })
    .where("RelationalTable.trainingSeries_ID", "=", id)
    .groupBy("teamMemberID");
}

function getUserNotificationCountData(id) {
  return db("User")
    .select(
      "User.notificationCount",
      "accountType.maxNotificationCount",
      "User.userID"
    )
    .join("accountType", "User.accountTypeID", "accountType.accountTypeID")
    .where({ userID: id })
    .first();
}

function increaseUserNotificationCount(id, count) {
  return db("User")
    .where({ userID: id })
    .update({ notificationCount: count });
}

// async function mimicking a forEach
async function asyncForEach(notifications, callback) {
  try {
    for (let i = 0; i < notifications.length; i++) {
      await callback(notifications[i]);
    }
  } catch (error) {
    console.log('async for each function error', error)
  }
}

// reset notification count at first of month for all users.
function resetNotificationCount() {
  return db("User")
    .where("notificationCount", ">", 0)
    .update({ notificationCount: 0 });
}

function deleteOldNotifications(today) {
  return db("Notifications")
    .where("sendDate", "<", today)
    .del();
}
