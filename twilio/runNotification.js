// To execute recurring logic, use worker function that queries the database for upcoming posts and sends reminders as necessary.
const runNotification = () => {
  return {
    run: () => {
      Appointment.sendNotifications();
      // Appointment in this example is the data model
      // sendNotification would be a function to post to twilio API with post information to send message
    }
  };
};

module.exports = runNotification;
