/*
 * Send messages to all appoinment owners via Twilio
 * @param {array} appointments List of appointments.
 */

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

function sendNotifications(appointments) {
  const client = new Twilio(accountSid, authToken);
  appointments.forEach(function(appointment) {
    // Create options to send the message
    const options = {
      to: `+ ${appointment.phoneNumber}`,
      from: cfg.twilioPhoneNumber,
      /* eslint-disable max-len */
      body: `Hi ${
        appointment.name
      }. Just a reminder that you have an appointment coming up.`
      /* eslint-enable max-len */
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
