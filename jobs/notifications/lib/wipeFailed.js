const Notifications = require("../../../models/db/notifications");

/**
 * Deletes all Notifications that have failed to send after 7 attempts.
 * 
 * Logs the number of Notifications that have been successfully deleted.
 *
 * @param {DateTime} time - A JavaScript DateTime string
 * 
 * @return {undefined}
 */
module.exports = async time => {
  // Get all Notifications where num_attempts is 7 and is_sent is false
  const deletion = await Notifications.remove({
    "n.num_attempts": 7,
    "n.is_sent": false
  })

  // If deletion is falsey we can assume that there were no records to delete
  if (!deletion) {
    return console.error(
      `There were no records to delete at this time: ${time}`
    );
  }

  // Log the number of records that have been deleted and exit
  return console.log(`${deletion} records deleted`);
};
