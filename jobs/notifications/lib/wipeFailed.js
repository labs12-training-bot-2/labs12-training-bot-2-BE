const Notifications = require('../../../models/db/notifications')

module.exports = async time => {
  console.log('Wiping failed notifications', time);
  
  const records = await Notifications.find({
    'n.num_sent': 7, 'n.is_sent': false
  })

  const failed = records.map(async r => {
    return await Notifications.remove({ 'n.id': r.id })
  })

  Promise.all(failed)
    .then(() => {
      console.log('All failed notifications have been removed')
    })
    .catch(err => {
      console.error('Error wiping failed notifications:', err)
    })
}