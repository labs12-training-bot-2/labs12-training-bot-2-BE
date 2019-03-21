require('dotenv').config();

const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const alexNumber = process.env.ALEX_NUMBER;

const client = new twilio(accountSid, authToken);

// test message when you run "node twilio.js" in terminal
client.messages
  .create({
    body: 'Hello from Node',
    to: alexNumber,
    from: twilioNumber
  })
  .then(message => console.log(message.sid));

// twilio application to send out posts based on start date of training material per member
// twilio application runs every minute to check what posts to send out

const sampleNotification = {
  bodyText:
    'Training bot has a reminder for you. Keep the customers drink filled they’ll make 40% more in tips. Read more https://pos.toasttab.com/blog/how-to-get-more-tips-as-a-server',
  to: alexNumber, // Text this number
  from: twilioNumber, // From a valid Twilio number
  date: 'Thu, 21 Mar 2019 18:20:00 GMT'
};

// twilio example appointment schema
// var AppointmentSchema = new mongoose.Schema({
//   name:String,
//   phoneNumber: String,
//   notification : Number,
//   timeZone : String,
//   time : {type : Date, index : true}
// });
