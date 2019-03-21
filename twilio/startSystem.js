const CronJob = require('cron').CronJob;
const moment = require('moment');

const runNotification = require('./runNotification');

// node-cron start function for notification system
const schedulerFactory = function() {
  return {
    start: function() {
      console.log('Before job instantiation');
      new CronJob(
        '00 30 11 * * 1-5', // interval set to 11:30am M-F.
        // '00 * * * * *'  // 1 minute interval for testing notification system.
        function() {
          const d = new Date();
          console.log('onTick:', d);
        },
        null,
        true,
        ''
      );
      console.log('After job instantiation');
      runNotification.run();
    }
  };
};

module.exports = schedulerFactory();
