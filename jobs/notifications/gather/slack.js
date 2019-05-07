// Gather all Slack notifications ready to be sent from the database and then send them
const moment = require("moment");

const {
  getDailySlackNotifications,
  asyncForEach
} = require("../../../models/db/notifications");
const sendSlackNotifications = require("../send/slack");

const today = moment().format("YYYY-MM-D");

const gatherSlackNotification = () => {
  return {
    run: async () => {
      const notifications = await getDailySlackNotifications(today);
      if (notifications.length === 0) {
        console.log("No Slack notifications from today.");
      } else {
        await asyncForEach(notifications, sendSlackNotifications);
      }
    }
  };
};

module.exports = gatherSlackNotification();
