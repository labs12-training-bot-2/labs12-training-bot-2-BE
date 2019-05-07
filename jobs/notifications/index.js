const CronJob = require("cron").CronJob;
const notify = require('./lib/notify');
const wipeFailed = require('./lib/wipeFailed')

// node-cron start function for notification system
const notificationSystem = function() {
  return {
    start: () => {
      new CronJob(
        "*/1 * * * * *",
        async function(onComplete) {
          try {
            const currentTime = new Date();
            console.log("Run Notifications onTick:", currentTime);
            await notify(currentTime);
            await onComplete(currentTime);
          } catch (error) {
            console.log("Notification start async error", error);
          }
        },
        async function(time) {
          try {
            await wipeFailed(time)
          }
          catch (error) {
            console.error(
              "There was an error removing outdated notifications", 
              error
            )
          }
        },
        true,
        "UTC"
      );
      console.log("Notification System Instantiation");
      console.log(new Date());
    },
  };
};

module.exports = notificationSystem();
