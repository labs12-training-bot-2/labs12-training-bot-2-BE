// dependencies
const moment = require("moment");

// function imports
const {
  getDailyTextNotifications,
  asyncForEach
} = require("../../../models/db/notifications");

const sendTextNotifications = require("../send/sms");

// format moment variable for query
const today = moment().format("YYYY-MM-D");

// query DB and get data from notification table
// pass into asyncForEach which loops through all the notifications, edits db, and sends to Twilio API
const gatherTextNotifications = () => {
  return {
    run: async () => {
      const notifications = await getDailyTextNotifications(today);
      if (notifications.length === 0) {
        console.log("No text notifications from today.");
      } else {
        await asyncForEach(notifications, sendTextNotifications);
      }
    }
  };
};

module.exports = gatherTextNotifications();
