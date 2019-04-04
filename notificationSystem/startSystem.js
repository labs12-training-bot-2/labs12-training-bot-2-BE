const CronJob = require('cron').CronJob;

const gatherTextNotifications = require('./gatherTextNotifications');
const gatherEmailNotifications = require('./gatherEmailNotifications');
const Notifications = require('../database/Helpers/notifications-model');

// node-cron start function for notification system
const notificationSystem = function() {
  return {
    start: () => {
      new CronJob(
        '00 30 11 * * *', // 11:30am PST
        // seconds (0-59), minutes (0-59), hours (0-23), days (0-31), month (0-12), day of week(0-7)
        // * === first to last
        // runs on  Coordinated Universal Time (UTC)
        // '00 * * * * *', // 1 minute interval for testing notification system.
        async function() {
          const currentTime = new Date();
          console.log('Run Notifications onTick:', currentTime);
          await gatherTextNotifications.run();
          await gatherEmailNotifications.run();
        },
        null,
        true,
        ''
      );
      console.log('Notification System Instantiation');
      console.log(new Date());
    },
    resetCountOnFirstOfMonth: () => {
      new CronJob(
        // runs at midnight on first of every month
        '00 00 00 01 * *',
        async function() {
          // reset notification count to 0 for all users
          await Notifications.resetNotificationCount();
          console.log('reset count triggered');
        },
        null,
        true,
        ''
      );
    },
    clearOldNotifications: () => {
      new CronJob(
        '00 00 00 * * *', // runs every night at midnight
        // '00 * * * * *', // runs every minute for testing
        async function() {
          let today = new Date();
          today.setUTCHours(00);
          today.setUTCMinutes(00);
          today.setUTCSeconds(00);

          await Notifications.deleteOldNotifications(today);
          console.log('delete old notifications');
        },
        null,
        true,
        ''
      );
    }
  };
};

module.exports = notificationSystem();
