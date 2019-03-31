const CronJob = require('cron').CronJob;

const gatherTextNotifications = require('./gatherTextNotifications');
const gatherEmailNotifications = require('./gatherEmailNotifications');

// node-cron start function for notification system
const notificationSystem = function () {
  return {
    start: () => {
      new CronJob(
        '00 30 11 * * *', // 11:30am PST
        // seconds (0-59), minutes (0-59), hours (0-23), days (0-31), month (0-12), day of week(0-7)
        // * === first to last
        // runs on  Coordinated Universal Time (UTC)
        // '00 * * * * *', // 1 minute interval for testing notification system.
        function () {
          const currentTime = new Date();
          console.log('Run Notifications onTick:', currentTime);
          gatherTextNotifications.run();
          gatherEmailNotifications.run();
        },
        null,
        true,
        ''
      );
      console.log('Notification System Instantiation');
      console.log(new Date());
    }
  };
};

module.exports = notificationSystem();
