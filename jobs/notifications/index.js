const CronJob = require("cron").CronJob;
const notify = require("./lib/notify");
const wipeFailed = require("./lib/wipeFailed");

/**
 * An IIFE called by PM2 to instantiate the Cron job that sends all of Training
 * Bot's pending Notifications
 *
 * @function
 *
 * IFEE Documentation on MDN
 * @see https://developer.mozilla.org/en-US/docs/Glossary/IIFE
 *
 * 'Cron' documentation on GitHub
 * @see https://github.com/kelektiv/node-cron#api
 *
 * PR2 ecosystem file that instantiates the Cron job
 * @see https://github.com/labs12-training-bot-2/labs12-training-bot-2-BE/blob/master/ecosystem.config.js
 *
 * @return {undefined}
 */
(function notificationSystem() {
  /**
   * A CronJob object.
   *
   * @constructor
   *
   * @param {String} time - A crontab string to specify when the job should run.
   * @see https://github.com/kelektiv/node-cron#cron-ranges
   *
   * @param {function} onTick - The function to fire at the time specified. If an onComplete callback was provided, onTick will receive it as an argument. onTick may call onComplete when it has finished its work.
   *
   * @param {function} onComplete - The function that will fire when the onTick function ends
   *
   * @param {boolean} [start] - Specifies whether to start the job before exiting the constructor. Defaults to false.
   *
   * @param {string} timezone - The timezone for the execution. See linked documentation below for timezone options, though I highly recommend leaving this in UTC
   * @see http://momentjs.com/timezone/
   */
  new CronJob(
    "0 */10 * * * *",
    async function(onComplete) {
      /**
       * An anonomous function run by CronJob at the interval specified in the CronTab. Runs the notify() function and then calls the onComplete function passed to it by CronJob
       *
       * @param [onComplete] {function} - An optional param that gets passed in by the constructor if it exists
       */
      try {
        // Get the current time for logging and also to pass to notify()
        const currentTime = new Date();

        // Log that the job has started on the server
        console.log("Run Notifications onTick:", currentTime);

        // Await the completion of the notify() function, exit to catch block if notify() rejects
        await notify(currentTime);

        // Await the completion of the onComplete function, exit to catch block if onComplete() rejects
        await onComplete(currentTime);
      } catch (error) {
        // If the onTick function fails at any point, log the error to stderr
        console.error("Notifications worker encountered an error", error);
      }
    },
    async function(time) {
      /**
       * An anonomous function that will be passed to the onTick function and called at the end of that function. Runs the wipeFailed() function.
       *
       * @param time {DateTime} - A JavaScript Datetime field
       */
      
      // Await the completion of the wipeFailed() function, exit to catch block in the onTick function if wipeFailed() rejects
      await wipeFailed(time);
    },
    true,
    "UTC"
  );

  // Log that the Notification System has been started
  console.log("Notification System Instantiation", new Date());
})();
