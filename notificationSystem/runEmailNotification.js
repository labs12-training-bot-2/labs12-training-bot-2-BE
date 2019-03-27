// dependencies
const moment = require('moment');

// function imports
const {
  getDailyEmailNotifications
} = require('../database/Helpers/notifications-model');

const sendEmailNotifications = require('./sendTextNotifications'); // write with sendgrid function

// format moment variable for query
const today = moment().format('YYYY-MM-D');

// query DB and get data from notification table
// pass into sendNotifications which posts to twilio API
const runEmailNotification = () => {
  return {
    run: async () => {
      const notificationsToSend = await getDailyEmailNotifications(today);
      sendEmailNotifications(notificationsToSend); // replace with sendgrid function
    }
  };
};

module.exports = runEmailNotification();
