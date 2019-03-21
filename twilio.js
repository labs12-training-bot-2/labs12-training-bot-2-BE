require('dotenv').config();

const server = require('./server');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN; // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

// test message when you run "node twilio.js" in terminal
client.messages
  .create({
    body: 'Hello from Node',
    to: '+12223334444', // Text this number
    from: '+12017620421' // From a valid Twilio number
  })
  .then(message => console.log(message.sid));

// twilio application to send out posts based on start date of training material per member
// twilio application runs every minute to check what posts to send out

const sampleNotification = {
  body:
    'Training bot has a reminder for you. Keep the customers drink filled they’ll make 40% more in tips. Read more https://pos.toasttab.com/blog/how-to-get-more-tips-as-a-server',
  to: '+14804896962', // Text this number
  from: '+12017620421', // From a valid Twilio number
  date: 'Thu, 21 Mar 2019 18:20:00 GMT'
};
