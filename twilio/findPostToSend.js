// find posts needing to be sent in the next minute
// Our recurring job uses a static model method of the Appointment model to query the database for appointments coming up in the current minute and send out reminder messages using a Twilio REST Client we previously initialized with our Twilio account credentials.
// Because of the fact that appointments are defined in different time zones, we use Moment.js library in order to properly query every upcoming appointment considering its time zone.
AppointmentSchema.methods.requiresNotification = function(date) {
  return (
    Math.round(
      moment
        .duration(
          moment(this.time)
            .tz(this.timeZone)
            .utc()
            .diff(moment(date).utc())
        )
        .asMinutes()
    ) === this.notification
  );
};

AppointmentSchema.statics.sendNotifications = function(callback) {
  // now
  const searchDate = new Date();
  Appointment.find().then(function(appointments) {
    appointments = appointments.filter(function(appointment) {
      return appointment.requiresNotification(searchDate);
    });
    if (appointments.length > 0) {
      sendNotifications(appointments);
    }
  });
};
