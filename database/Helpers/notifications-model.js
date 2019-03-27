const db = require("../dbConfig.js");

module.exports = {
  getDailyTextNotifications,
  getDailyEmailNotifications
};

function getDailyTextNotifications(day) {
  return db("Notifications")
    .select("phoneNumber", "postName", "postDetails", "link")
    .where({ sendDate: day });
}

function getDailyEmailNotifications(day) {
  return db("Notifications")
    .select("email", "postName", "postDetails", "link", "firstName", "lastName")
    .where({ sendDate: day });
}
