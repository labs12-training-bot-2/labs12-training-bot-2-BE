// SendGrid configuration
const sgMail = require("@sendgrid/mail");
const uuid = require("uuid");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = n => {
  const thread = `${uuid()}@mail.trainingbot.app`;
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
      ...n,
      thread,
      num_attempts: n.num_attempts + 1,
      is_sent: true
    }));
};
