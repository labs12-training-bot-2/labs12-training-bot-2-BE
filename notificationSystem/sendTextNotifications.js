// Twilio API, Send incoming notifications as text message

require('dotenv').config();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

function sendTextNotifications(notifications) {
  const client = new twilio(accountSid, authToken);
  notifications.forEach(notification => {
    // Create options to send the message
    const options = {
      to: notification.phoneNumber,
      from: process.env.TWILIO_NUMBER,
      body: `${notification.postName}  ${notification.postDetails} Read more: ${
        notification.link
      }`
    };

    // Send the message!
    client.messages.create(options, function(err, response) {
      if (err) {
        console.error(err);
      } else {
        // Log the last few digits of a phone number
        let masked = options.to.substr(0, options.to.length - 5);
        masked += '*****';
        console.log(`Message sent to ${masked}`);
      }
    });
  });
}

module.exports = sendTextNotifications;
