// Resolve environment variables in .env file for development
// Has no effect in production
require("dotenv").config();

// Models
const Notifications = require("../../../models/db/notifications");

// Sender functions
const { sendEmail, sendSms, sendSlack } = require("./senders");

// Helper functions
const { batchUpdate, asyncMap } = require("./common");

/**
 * Fetches all notifications from that database that need to be sent (i.e. the send_date value is less than or equal to the time passed in) and processes them.
 *
 * @function
 *
 * @param {DateTime} time - A JavaScript DateTime used for filtering the notifications to send
 * 
 * @return {undefined}
 */
module.exports = async time => {
  // Log the start of the attempt to send
  console.log("Sending notifications", time);

  // Await all Notifications from the database where is_sent is false and 
  // send_date is less than or equal to the time parameter
  const notifs = await Notifications.find({ is_sent: false }).andWhere(
    "n.send_date",
    "<=",
    time
  );

  // Filter the notifications array to separate the notifications by service
  const slackNotifs = notifs.filter(n => n.name === "slack");
  const smsNotifs = notifs.filter(n => n.name === "twilio");
  const emailNotifs = notifs.filter(n => n.name === "sendgrid");

  // Pass each array of service-based notifications to the asyncMap helper 
  // function, along with the service-specific sender callback function, so 
  // that they can be sent out.
  const sendingSlack = await asyncMap(slackNotifs, sendSlack);
  const sendingSms = await asyncMap(smsNotifs, sendSms);
  const sendingEmail = await asyncMap(emailNotifs, sendEmail);

  // Combine the returned array of sent functions into a flattend array of 
  // Notification objects
  const updates = [...sendingSms, ...sendingEmail, ...sendingSlack];

  // Send the flattened array of Notification objects to the batchUpdate 
  // function, specifying that they should be used to update the 
  // 'notifications' table in the database
  batchUpdate("notifications", updates);

  // Log the successful completion of the Notifications job
  console.log("Notifications sent:", new Date());
};
