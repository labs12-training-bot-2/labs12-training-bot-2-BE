// Configure Twilio
const twilioSid = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioClient = require("twilio")(twilioSid, twilioToken);

/**
 * Takes a Notification object (n) and attempts to send it via Twilio
 *
 * Purposefully doesn't attempt to catch errors so that errors bubble up to the function that calls it.
 *
 * @param {Object} n - A Notification object
 * @return {Object} - An updated Notification object
 */
module.exports = n => {
  return twilioClient.messages
    .create({
      body: `${n.subject}:\n${n.body}\n\n${n.link ? n.link : ""}`,
      from: twilioNumber,
      to: n.phone_number
    })
    .then(r => ({
      id: n.id,
      thread: r.sid,
      num_attempts: n.num_attempts + 1,
      is_sent: true
    }));
};
