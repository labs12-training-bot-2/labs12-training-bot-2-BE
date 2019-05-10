require("dotenv").config();
const Notifications = require("../../../models/db/notifications");
const { sendEmail, sendSms, sendSlack } = require("./senders");
const { batchUpdate, asyncMap } = require("./common");

module.exports = async time => {
  try {
    console.log("Sending notifications", time);

    const notifs = await Notifications.find({ is_sent: false }).andWhere(
      "n.send_date",
      "<=",
      time
    );

    // Organize notifications by service
    const slackNotifs = notifs.filter(n => n.name === "slack");
    const smsNotifs = notifs.filter(n => n.name === "twilio");
    const emailNotifs = notifs.filter(n => n.name === "sendgrid");

    // Send notifications by service
    const sendingSlack = await asyncMap(slackNotifs, sendSlack);
    const sendingSms = await asyncMap(smsNotifs, sendSms);
    const sendingEmail = await asyncMap(emailNotifs, sendEmail);

    // Combine notifications from all services and batch update the database
    const updates = [...sendingSms, ...sendingEmail, ...sendingSlack]
    batchUpdate("notifications", updates);
  } catch (e) {
    console.error("Error sending notifications:", e);
  }
};
