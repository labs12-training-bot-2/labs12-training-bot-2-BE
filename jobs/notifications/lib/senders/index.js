const sendSms = require('./sms');
const sendEmail = require('./email');
const sendSlack = require('./slack');

module.exports = {
  sendSms,
  sendEmail,
  sendSlack
}