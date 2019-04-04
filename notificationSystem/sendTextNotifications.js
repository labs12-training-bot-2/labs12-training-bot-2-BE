// Twilio API, Send incoming notifications as text message

require("dotenv").config();

const Notifications = require("../database/Helpers/notifications-model");
const twilio = require("twilio");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

/* 
Notes for later: Can a variable be created outside of the functions that stores the notification count of the user?
Then potentially pass it into sen
*/
async function asyncForEach(notifications, callback) {
  for (let i = 0; i < notifications.length; i++) {
    await callback(notifications[i]);
  }
}

async function sendTextNotifications(notification) {
  const client = new twilio(accountSid, authToken);
    // use notification.userID to query db.Users to get the user information
    // also query db.accountType where user.accountTypeID = accountType.accountTypeID
    const userCountData = await Notifications.getUserNotificationCountData(
      notification.userID
    );
    console.log("userCountData", userCountData);

    // compare User.notificationCount to accountType.maxNotificationCount
    if (userCountData.notificationCount < userCountData.maxNotificationCount) {
      // if less than, continue sending messages
      let newValue = await userCountData.notificationCount + 1;
      console.log("newValue", newValue);
      // Create options to send the message
      const options = {
        to: notification.phoneNumber,
        from: process.env.TWILIO_NUMBER,
        body: `${notification.postName}  ${
          notification.postDetails
        } Read more: ${notification.link}`
      };

      // Send the message!
      await client.messages.create(options, function(err, response) {
        if (err) {
          console.error(err);
        } else {
          // for every notification sent, increase User.notificationCount by 

          // Log the last few digits of a phone number
          let masked = options.to.substr(0, options.to.length - 5);
          masked += "*****";
          console.log(`Message sent to ${masked}`);
        }
      });

      await Notifications.increaseUserNotificationCount(
        notification.userID,
        newValue
      );
    }
}

module.exports = {sendTextNotifications, asyncForEach};
