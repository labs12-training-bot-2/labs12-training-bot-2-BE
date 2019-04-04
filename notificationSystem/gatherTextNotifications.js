// dependencies
const moment = require("moment");

// function imports
const {
  getDailyTextNotifications
} = require("../database/Helpers/notifications-model");
const {
  sendTextNotifications,
  asyncForEach
} = require("./sendTextNotifications");

// format moment variable for query
const today = moment().format("YYYY-MM-D");

// query DB and get data from notification table
// pass into asyncForEach which loops through all the notifications, edits db, and sends to Twilio API
const gatherTextNotifications = () => {
  return {
    run: async () => {
      const notifications = await getDailyTextNotifications(today);

      await asyncForEach(notifications, sendTextNotifications);
    }
  };
};

module.exports = gatherTextNotifications();
