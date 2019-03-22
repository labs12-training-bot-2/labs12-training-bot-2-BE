require('dotenv').config();

const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const alexNumber = process.env.ALEX_NUMBER;

// const client = new twilio(accountSid, authToken);

// test message when you run "node twilio.js" in terminal
// client.messages
//   .create({
//     bodyText: 'Hello from Node',
//     to: alexNumber,
//     from: twilioNumber
//   })
//   .then(message => console.log(message.sid));

const sampleNotificationData = [
  {
    bodyText:
      'Training bot has a reminder for you. Keep the customers drink filled they’ll make 40% more in tips. Read more https://pos.toasttab.com/blog/how-to-get-more-tips-as-a-server',
    to: alexNumber, // Text this number
    from: twilioNumber, // From a valid Twilio number
    date: 'Thu, 21 Mar 2019 18:20:00 GMT'
  }
];

module.exports = sampleNotificationData;
