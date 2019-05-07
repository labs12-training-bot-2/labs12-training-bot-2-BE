const axios = require("axios");
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance()
const sgMail = require("@sendgrid/mail");
const twilio = require("twilio");

const Notifications = require("../../../models/db/notifications");

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
        return {};
      case "sendgrid":
        return {};
    }
  });
};

function sendEmail() {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
function sendSms() {}
function sendSlack() {}
