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
    console.log(notifs);

    const slackNotifs = notifs.filter(n => n.name === "slack");
    const smsNotifs = notifs.filter(n => n.name === "twilio");
    const emailNotifs = notifs.filter(n => n.name === "sendgrid");

    const sendingSlack = await asyncMap(slackNotifs, sendSlack);
    const sendingSms = await asyncMap(smsNotifs, sendSms);
    const sendingEmail = await asyncMap(emailNotifs, sendEmail);

    // Update num_attempts and is_sent for all notifications
    const updates = [...sendingSms, ...sendingEmail, ...sendingSlack].map(n => {
      return {
        id: n.id,
        num_attempts: n.num_attempts,
        thread: n.thread
      }
    });
    batchUpdate("notifications", updates);

    // Log the completion of the Notification event
    console.log("Notifications sent:", new Date());
  } catch (e) {
    console.error("Error sending notifications:", e);
  }
};
