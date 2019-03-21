const CronJob = require('cron').CronJob;
const moment = require('moment');

const runNotification = require('./runNotification');

// node-cron start function for notification system, notification interval set to one minute.
const schedulerFactory = function() {
  return {
    start: function() {
      new CronJob(
        '00 * * * * *',
        function() {
          console.log(
            'Running Send Notifications Worker for ' + moment().format()
          );
          runNotification.run();
        },
        null,
        true,
        ''
      );
    }
  };
};

module.exports = schedulerFactory();
