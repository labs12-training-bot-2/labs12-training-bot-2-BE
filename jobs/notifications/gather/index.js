// dependencies
const moment = require("moment");

// function imports
const {
  getDailyEmailNotifications,
  getDailyTextNotifications,
  getDailySlackNotifications,
  asyncForEach
} = require("../../../models/db/notifications");

const sendEmailNotifications = require("../send/email");
const sendTextNotifications = require("../send/sms");
const sendSlackNotifications = require("../send/slack");

// format moment variable for query
const today = moment().format("YYYY-MM-D");

const notifications = {
  get: {
    email: getDailyEmailNotifications,
    text: getDailyTextNotifications,
    slack: getDailySlackNotifications
  },
  send: {
    email: sendEmailNotifications,
    text: sendTextNotifications,
    slack: sendSlackNotifications
  }
};

// query DB and get data from notification table
// pass into sendNotifications which posts to twilio API
const gatherNotifications = context => {
  return {
    run: async () => {
      const contextNotifications = await notifications.get[context](today);
      if (contextNotifications.length) {
        await asyncForEach(contextNotifications, notifications.send[context]);
      } else {
        console.log(`No ${context} notifications from today.`);
      }
    }
  };
};

module.exports = gatherNotifications();
