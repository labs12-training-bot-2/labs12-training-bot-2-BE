// dependencies
const moment = require("moment");

// function imports
const {
  getDailyEmailNotifications,
  asyncForEach
} = require("../../../models/db/notifications");

const sendEmailNotifications = require("../send/email"); // write with sendgrid function

// format moment variable for query
const today = moment().format("YYYY-MM-D");

// query DB and get data from notification table
// pass into sendNotifications which posts to twilio API
const gatherEmailNotification = () => {
  return {
    run: async () => {
      const notifications = await getDailyEmailNotifications(today);
      if (notifications.length === 0) {
        console.log("No email notifications from today.");
      } else {
        await asyncForEach(notifications, sendEmailNotifications);
      }
    }
  };
};

module.exports = gatherEmailNotification();
