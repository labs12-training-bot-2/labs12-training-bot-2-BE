// dependencies
const moment = require('moment');

// function imports
const {
  getDailyTextNotifications
} = require('../database/Helpers/notifications-model');
const sendNotifications = require('./sendNotifications');

// format moment variable for query
const today = moment().format('YYYY-MM-D');

// query DB and get data from notification table
// pass into sendNotifications which posts to twilio API
const runNotification = () => {
  return {
    run: async () => {
      const notificationsToSend = await getDailyTextNotifications(today);
      sendNotifications(notificationsToSend);
    }
  };
};

module.exports = runNotification();
