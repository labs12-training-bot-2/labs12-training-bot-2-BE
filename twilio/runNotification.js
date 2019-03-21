// To execute recurring logic, use worker function that queries the database for upcoming posts and sends reminders as necessary.
const sendNotifications = require('./sendNotifications');

const runNotification = () => {
  return {
    run: () => {
      sendNotifications;
      // connect to post data model here
      // sendNotification would be a function to post to twilio API with post information to send message
    }
  };
};

module.exports = runNotification;
