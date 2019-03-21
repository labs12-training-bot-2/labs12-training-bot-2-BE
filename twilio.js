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

// user information passed into notification function below

// Every minute we'd like our application to check the appointments database to see if any appointments are coming up that require reminders to be sent out.

// To do this we use node-cron.

// We configure on the start function both the job code we'd like to run, and the interval on which to run it. Then we call it from the application execution entry point like this: scheduler.start()

// sample - schedule a job to send a reminder
// This start function uses a notificationsWorker, next we'll see how it works.
// const CronJob = require('cron').CronJob;
// const notificationsWorker = require('./workers/notificationsWorker');
// const moment = require('moment');

// const schedulerFactory = function() {
//   return {
//     start: function() {
//       new CronJob('00 * * * * *', function() {
//         console.log('Running Send Notifications Worker for ' +
//           moment().format());
//         notificationsWorker.run();
//       }, null, true, '');
//     },
//   };
// };

// module.exports = schedulerFactory();

// To actually execute our recurring job logic, we create a worker function which uses a Static Model Method to query the database for upcoming appointments and sends reminders as necessary.

// const Appointment = require('../models/appointment');

// const notificationWorkerFactory = function() {
//   return {
//     run: function() {
//       Appointment.sendNotifications();
//     },
//   };
// };

// module.exports = notificationWorkerFactory();
