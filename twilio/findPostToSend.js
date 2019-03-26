// find posts needing to be sent in the next minute
// Our recurring job uses a static model method of the Appointment model to query the database for appointments coming up in the current minute and send out reminder messages using a Twilio REST Client we previously initialized with our Twilio account credentials.
// Because of the fact that appointments are defined in different time zones, we use Moment.js library in order to properly query every upcoming appointment considering its time zone.








// get a list of relations, which contain teamMember_id, trainingSeries_id, and start date for training series
// if start date + integer value (from post) = today's date, then store those posts in an array

//  get full list of posts

// get a list of training series to compare start times of team member to current date


// send posts from training series based on comparison


// start date on post needs to be changed to integer
// team member has a state date for training series
// each post has an integer of 1, 2, 3, etc which compares to relation table start date.
// compare 

// if relationalTable.startDate + post.startDate = current date, then that post needs to be sent to team member information








// filter array of posts down to posts that need notifications










// AppointmentSchema.methods.requiresNotification = function (date) {
//   return (
//     Math.round(
//       moment
//         .duration(
//           moment(this.time)
//             .tz(this.timeZone)
//             .utc()
//             .diff(moment(date).utc())
//         )
//         .asMinutes()
//     ) === this.notification
//   );
// };

// AppointmentSchema.statics.sendNotifications = function (callback) {
//   // now
//   const searchDate = new Date();
//   Appointment.find().then(function (appointments) {
//     appointments = appointments.filter(function (appointment) {
//       return appointment.requiresNotification(searchDate);
//     });
//     if (appointments.length > 0) {
//       sendNotifications(appointments);
//     }
//   });
// };
