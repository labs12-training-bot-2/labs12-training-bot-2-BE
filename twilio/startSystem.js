const CronJob = require('cron').CronJob;

const runNotification = require('./runNotification');
// node-cron start function for notification system

const notificationSystem = function() {
  return {
    start: () => {
      console.log('Before job instantiation');
      new CronJob(
        // '00 30 11 * * 1-5', // interval set to 11:30am M-F.
        '00 * * * * *', // 1 minute interval for testing notification system.
        function() {
          const d = new Date();
          console.log('onTick:', d);
          runNotification.run();
        },
        null,
        true,
        ''
      );
      console.log('After job instantiation');
    }
  };
};

module.exports = notificationSystem();
