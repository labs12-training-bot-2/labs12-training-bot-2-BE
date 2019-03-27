// using SendGrid's v3 Node.js Library
require('dotenv').config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailNotifications = notifications => {
  notifications.forEach(notification => {
    const options = {
      to: 'kingaa6@gmail.com',
      from: 'trainingbotlabs11@gmail.com',
      subject: `A Reminder from Training Bot - ${notification.postName}`,
      html: `<h1>Hello, ${notification.firstName} ${
        notification.lastName
      }!</h1><p>Here's a quick reminder for you from your team lead.</p><hr><h2>${
        notification.postName
      }</h2>
      <p>${notification.postDetails}</p>
      <p>Read more:<a>${notification.link}</a></p>`
    };

    sgMail.send(options);
  });
};

module.exports = sendEmailNotifications;
