// dependencies
const moment = require('moment');

// function imports
const {
  getDailyEmailNotifications
} = require('../database/Helpers/notifications-model');

const sendEmailNotifications = require('./sendEmailNotifications'); // write with sendgrid function

// format moment variable for query
const today = moment().format('YYYY-MM-D');

// query DB and get data from notification table
// pass into sendNotifications which posts to twilio API
const gatherEmailNotification = () => {
  return {
    run: async () => {
      const notifications = await getDailyEmailNotifications(today);

      sendEmailNotifications(notifications);
    }
  };
};

module.exports = gatherEmailNotification();
