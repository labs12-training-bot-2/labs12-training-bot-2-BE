const CronJob = require("cron").CronJob;
const notify = require("./lib/notify");
const wipeFailed = require("./lib/wipeFailed");

(function notificationSystem() {
  /**
   * A CronJob object.
   *
   * @constructor
   *
   * @param time {String} - A crontab string to specify when the job should run.
   * @see https://github.com/kelektiv/node-cron#cron-ranges
   *
   * @param onTick {function} - The function to fire at the time specified. If an onComplete callback was provided, onTick will receive it as an argument. onTick may call onComplete when it has finished its work.
   *
   * @param onComplete {function} - The function that will fire when the onTick function ends
   *
   * @param start {boolean} - Specifies whether to start the job before exiting the constructor.
   *
   * @param timezone {string} - The timezone for the execution. See linked documentation below for timezone options, though I highly recommend leaving this in UTC
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
