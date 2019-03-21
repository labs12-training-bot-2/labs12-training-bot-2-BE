const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN; // Your Auth Token from www.twilio.com/console

const client = new twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Hello from Node',
    to: '+14804896962', // Text this number
    from: '+12017620421' // From a valid Twilio number
  })
  .then(message => console.log(message.sid));
