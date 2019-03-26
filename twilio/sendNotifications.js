/*
 * Send messages to all appointment owners via Twilio
 * @param {array} appointments List of appointments.
 */


require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

function sendNotifications(notifications) {
  const client = new twilio(accountSid, authToken);
  notifications.forEach(notification => {
    // Create options to send the message
    const options = {
      to: `+ ${notification.phoneNumber}`, // input dynamic number from user
      from: process.env.TWILIO_NUMBER,
      body: `${notification.postName}  ${notification.postDetails} Read more: ${notification.link}`
    };

    // Send the message!
    console.log(options)
    // client.messages.create(options, function (err, response) {
    //   if (err) {
    //     // Just log it for now
    //     console.error(err);
    //   } else {
    //     // Log the last few digits of a phone number
    //     let masked = post.to.substr(0, post.to.length - 5);
    //     masked += '*****';
    //     console.log(`Message sent to ${masked}`);
    //   }
    // });
  });

  // Don't wait on success/failure, just indicate all messages have been
  // queued for delivery
  // if (callback) {
  //   callback.call();
  // }
}

// sendNotifications();

module.exports = sendNotifications;
