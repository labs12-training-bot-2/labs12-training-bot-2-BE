// using SendGrid's v3 Node.js Library
require('dotenv').config();

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>'
};

const sendEmailNotifications = notifications => {
  notifications.forEach(notification => {
    const options = {
      to: notification.email,
      from: 'trainingbotlabs11@gmail.com',
      subject: `A Reminder from Training Bot - ${notification.postName}`,
      html: `<h2>${notification.postName}</h2>
      <p>${postDetails}</p>
      <p>Read more:<a>${notification.link}</a></p>`
    };

    sgMail.send(options);
  });
};

module.exports = sendEmailNotifications;
