const Notifications = require('../../../models/db/notifications')

/** 
 * An async function takes a Date object and then removes 
 * all notifications that Training Bot considers to be 
 * failed based on the time input and the number of attempts
 * 
 * @module wipeFailed
 * @function
 * @returns {string}
*/
module.exports = async () => {
  const deletion = await Notifications.remove({
    'n.num_attempts': 7, 'n.is_sent': false
  }).catch(e => console.error(e))

  return `${deletion} records deleted`
  }