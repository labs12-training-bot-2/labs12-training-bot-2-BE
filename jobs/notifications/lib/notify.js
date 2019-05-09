const axios = require("axios");
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

// SendGrid configuration
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Twilio Configuration
const twilioSid = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioClient = require("twilio")(twilioSid, twilioToken);

const Notifications = require("../../../models/db/notifications");
const Tokens = require("../../../models/db/tokens");
const { batchUpdate } = require("./common");

module.exports = async time => {
  try {
  console.log("Sending notifications", time);

    const notifs = await Notifications
      .find({ is_sent: false })
      .andWhere("n.send_date", "<=", time);

    const slackTokens = await Tokens.find({ "s.name": "slack" });

    const updates = notifs.map(n => {
      switch (n.name) {
      case "slack":
          // Get the auth_token belonging to the user out of slackTokens
          const { auth_token } = slackTokens.filter(t => t.user === n.admin)[0];
          
          // 

          return {
            id: n.id,
            num_attempts: n.num_attempts + 1
          };
      case "twilio":

          // Rate limit sendSms to 500 messages/second (twilio's limit) and send
          setTimeout(() => sendSms(n), 2);
        
          return {
            id: n.id,
            num_attempts: n.num_attempts + 1
          };
      case "sendgrid":
          return {
            id: n.id,
            num_attempts: n.num_attempts + 1
          };
    }
  });
    // Send the array of updated notifications to batchUpdates
    batchUpdate("notifications", updates);

    // Log the completion of the Notification event
    console.log("Notifications sent:", new Date());
  } catch (e) {
    console.error("Error sending notifications:", e);
  }
};

function sendEmail() {}

function sendSms({ phone_number, subject, message, link }) {
  twilioClient.messages.create({
    body: `${subject}: ${message}\n${link ? link : ""}`,
    from: twilioNumber,
    to: phone_number
  });
}

function sendSlack() {}
