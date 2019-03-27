// To execute recurring logic, use worker function that queries the database for upcoming posts and sends reminders as necessary.
const sendNotifications = require('./sendNotifications');

// bring in array of notifications table.
const testArray = [
  {
    startDate: "2019-04-05 00:00:00",
    trainingSeries: "modi deserunt distinctio suscipit at",
    firstName: "Marcelina",
    lastName: "Funk",
    phoneNumber: "098-075-4149 x260",
    postName: "ad ipsum minima dolorem dolore",
    postDetails: "Placeat nam facere vitae nisi quis tenetur. E",
    link: "http://dayton.com",
    Post_StartDate: "2019-04-06 00:00:00"
  },
  {
    startDate: "2019-04-05 00:00:00",
    trainingSeries: "modi deserunt distinctio suscipit at",
    firstName: "Marcelina",
    lastName: "Funk",
    phoneNumber: "098-075-4149 x260",
    postName: "ea corrupti architecto provident dolores",
    postDetails: "Voluptas pariatur itaque nostrum. Assumenda a",
    link: "https://freeda.net",
    Post_StartDate: "2019-04-06 00:00:00"
  }
]




const runNotification = () => {
  return {
    run: () => {
      sendNotifications(testArray);
      // connect to notification table to get array of notifications that need to be sent each day
      // sendNotification takes in array of notifications
      // then loops through each notification and sends to twilio
    },
  };
};

module.exports = runNotification();
