/*
 * Send messages to all appointment owners via Twilio
 * @param {array} appointments List of appointments.
 */

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const alexNumber = process.env.ALEX_NUMBER;

const sampleNotification = {
  bodyText:
    'Training bot has a reminder for you. Keep the customers drink filled they’ll make 40% more in tips. Read more https://pos.toasttab.com/blog/how-to-get-more-tips-as-a-server',
  to: alexNumber, // Text this number
  from: twilioNumber, // From a valid Twilio number
  date: 'Thu, 21 Mar 2019 18:20:00 GMT'
};

function sendNotifications(appointments) {
  const client = new Twilio(accountSid, authToken);
  appointments.forEach(function(appointment) {
    // Create options to send the message
    const options = {
      to: `+ ${alexNumber}`, // input dynamic number from user
      from: twilioNumber, // leave this number fixed
      body: `${sampleNotification.bodyText}`
    };

    // Send the message!
    client.messages.create(options, function(err, response) {
      if (err) {
        // Just log it for now
        console.error(err);
      } else {
        // Log the last few digits of a phone number
        let masked = appointment.phoneNumber.substr(
          0,
          appointment.phoneNumber.length - 5
        );
        masked += '*****';
        console.log(`Message sent to ${masked}`);
      }
    });
  });

  // Don't wait on success/failure, just indicate all messages have been
  // queued for delivery
  if (callback) {
    callback.call();
  }
}
