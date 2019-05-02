// Twilio API, Send incoming notifications as text message

require("dotenv").config();

const Notifications = require("../database/Helpers/notifications-model");
const twilio = require("twilio");

// Get an instance of `PhoneNumberUtil`.
const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;

async function sendTextNotifications(notification) {
  // phone validation to prevent empty numbers from progressing the function
  if (notification.phone_number === "") {
    await Notifications.markNotificationAsSent(notification.id, {
      text_on: false,
      text_sent: true
    });
    console.log("Empty phone number found, mark as inactive");
  }

  // run logic to check which texts need to be sent
  else if (!notification.text_sent && notification.text_on) {
    console.log(
      notification.phoneNumber,
      "text active, continue running send function"
    );
    try {
      const client = new twilio(accountSid, authToken);

      // use notification.userID to get user's current notification account and their account type's max count
      const userCountData = await Notifications.getUserNotificationCountData(
        notification.user_id
      );

      if (
        userCountData.notification_count ===
        userCountData.max_notification_count
      ) {
        console.log("User has reached maximum notification this month");
      }

      // compare User.notificationCount to accountType.maxNotificationCount
      else if (
        userCountData.notification_count < userCountData.max_notification_count
      ) {
        // if less than, continue sending messages and increase notification count by 1
        let newValue = (await userCountData.notification_count) + 1;

        // Create options to send the message
        const options = {
          to: notification.phone_number,
          from: process.env.TWILIO_NUMBER,
          body: `${notification.message_name}  ${
            notification.message_details
          } Read more: ${notification.link}`
        };

        // Parse number with country code and keep raw input.
        const number = await phoneUtil.parseAndKeepRawInput(
          notification.phone_number,
          "US"
        );

        // Send the message!
        if (phoneUtil.isValidNumberForRegion(number, "US")) {
          await client.messages.create(options, function(err, response) {
            if (err) {
              console.error(err);
            } else {
              // Hide the last few digits of a phone number
              let masked = options.to.substr(0, options.to.length - 5);
              masked += "*****";
              console.log(`Message sent to ${masked}`);
            }
          });

          // send updated notificationCount to the database
          await Notifications.increaseUserNotificationCount(
            notification.user_id,
            newValue
          );

          await Notifications.markNotificationAsSent(notification.id, {
            text_sent: true
          });
        } else {
          console.log(
            notification.phone_number,
            "is not valid, skipping invalid phone number"
          );
          // if phone number is not valid, deactivate and mark as sent (temporary logic to ensure it doesn't keep trying to send this)
          await Notifications.markNotificationAsSent(notification.id, {
            text_on: false,
            text_sent: true
          });
        }
      } else {
        console.log(
          "Maximum notification count has been reached for this user"
        );
      }
    } catch (error) {
      console.log("text notification function error", error);
    }
  } else {
    console.log("text marked as inactive or already marked as sent");
  }
}

module.exports = sendTextNotifications;
