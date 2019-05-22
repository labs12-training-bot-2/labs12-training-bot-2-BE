// Dependencies
const sgMail = require("@sendgrid/mail");
const uuid = require("uuid");

// SendGrid Configuration
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Takes a Notification object (n) and attempts to send it via SendGrid
 * 
 * Purposefully doesn't attempt to catch errors so that errors bubble up to the function that calls it.
 * 
 * @param {Object} n - A Notification object
 * @return {Object} - An updated Notification object
 */
module.exports = n => {
  // Generate a random reply-to email address to track responses
  const thread = `${uuid()}@mail.trainingbot.app`;

  // Attempt to send the message via SendGrid, then return an updated 
  // Notification object that inludes the random thread, increments 
  // num_attempts, and changes is_sent to true
  return sgMail.send({
      to: `${n.email}`,
      from: {
        email: "notifications@trainingbot.app",
        name: "Training Bot"
      },
      replyTo: {
        email: thread,
        name: "Training Bot"
      },
      dynamicTemplateData: {
        big_subject: `${n.subject} - A Reminder from Training Bot`,
        first_name: n.first_name,
        subject: n.subject,
        body: n.body,
        link: n.link
      },
      templateId: "d-0aad15c066e047aa8eb1ce02e7d17611"
    })
    .then(_ => ({
      id: n.id,
      thread,
      num_attempts: n.num_attempts + 1,
      is_sent: true
    }));
};
