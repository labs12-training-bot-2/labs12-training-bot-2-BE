const Notifications = require('../../../models/db/notifications')

module.exports = async time => {
  Promise.resolve(console.log('Wiping failed notifications', time));
  
  // const deletion = await Notifications.remove({
  //   'n.num_attempts': 7, 'n.is_sent': false
  // }).catch(e => console.error(e))

  // return deletion 
  //   ? `${deletion} records deleted` 
  //   : `There was a problem deleting those records: ${deletion}`
  }