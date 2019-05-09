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
  console.log("Sending notifications", time);

  const notifs = await Notifications.find("n.send_date", "<=", time).andWhere({
    "n.is_sent": false
  });

  notifs.map(n => {
    switch (n.service) {
      case "slack":
        return {};
      case "twilio":
        sendSms(n)
          .then(r => {
            console.log(r)
          })
          .catch(e => console.log(e))
        
      case "sendgrid":
        return {};
    }
  });
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
