// Twilio Configuration
const twilioSid = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const twilioClient = require("twilio")(twilioSid, twilioToken);

module.exports = (n) => {
  return twilioClient.messages.create({
    body: `${n.subject}:\n${n.body}\n\n${n.link ? n.link : ""}`,
    from: twilioNumber,
    to: n.phone_number
  }).then(r => ({
    id: n.id,
    thread: r.sid,
    num_attempts: n.num_attempts + 1,
    is_sent: true
  }))
};
