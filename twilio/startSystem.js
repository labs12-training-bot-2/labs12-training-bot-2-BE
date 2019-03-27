const CronJob = require('cron').CronJob;

const runNotification = require('./runNotification');
// node-cron start function for notification system

const notificationSystem = function () {
  return {
    start: () => {
      new CronJob(
        // '00 30 11 * * 1-5', // interval set to 11:30am M-F.
        '00 * * * * *', // 1 minute interval for testing notification system.
        function () {
          const currentTime = new Date();
          console.log('onTick:', currentTime);
          console.log(currentTime);
          runNotification.run(); // triggers twilio notification to send
          // runNotification.test(currentTime);
        },
        null,
        true,
        ''
      );
      console.log('Notification System Instantiation');
    }
  };
};

module.exports = notificationSystem();
