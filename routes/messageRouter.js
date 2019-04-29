// Dependencies
const router = require("express").Router();
const moment = require("moment");

// Models
const Messages = require("../database/Helpers/post-model");
const Notifications = require("../database/Helpers/notifications-model");
const TeamMember = require("../database/Helpers/teamMember-model");

// Routes
// POST a new message
router.post("/", async (req, res) => {
  try {
    const {
      message_name,
      message_details,
      days_from_start,
      training_series_id
    } = req.body;

    if (
      !message_name ||
      !message_details ||
      !days_from_start ||
      !training_series_id
    ) {
      res.status(400).json({ error: "Client must provide all fields." });
    } else {
      // add new message to database
      const newMessage = await Messages.add(req.body);

      // see if the training series the new message belongs to exists in Notifications table
      const rows = await Notifications.getTrainingSeriesOfNewMessage(
        training_series_id
      );

      // if it does, for each assignment per team member id, assemble a new object to be inserted to the notifications table with the new message information
      // generate new object to update the notification table based on updated conditional
      //todo: rewrite the next three return statements into a single return object that only has the relevant props being altered

      if (rows.length > 0) {
        const entriesToInsert = rows.map(row => {
          if (row.email_on && !row.text_on) {
            return {
              message_id: newMessage.message_id,
              message_name: newMessage.message_name,
              message_details: newMessage.message_details,
              link: newMessage.link,
              days_from_start: newMessage.days_from_start,
              send_date: moment(row.start_date)
                .add(newMessage.days_from_start, "days")
                .format(),
              first_name: row.first_name,
              last_name: row.last_name,
              team_member_id: row.team_member_id,
              job_description: row.job_description,
              phone_number: "",
              email: row.email,
              email_on: row.email_on,
              text_on: row.text_on,
              training_series_id: newMessage.training_series_id,
              user_id: row.user_id
            };
          } else if (row.text_on && !row.email_on) {
            return {
              message_id: newMessage.message_id,
              message_name: newMessage.message_name,
              message_details: newMessage.message_details,
              link: newMessage.link,
              days_from_start: newMessage.days_from_start,
              send_date: moment(row.start_date)
                .add(newMessage.days_from_start, "days")
                .format(),
              first_name: row.first_name,
              last_name: row.last_name,
              team_member_id: row.team_member_id,
              job_description: row.job_description,
              phone_number: row.phone_number,
              email: "",
              email_on: row.email_on,
              text_on: row.text_on,
              training_series_id: newMessage.training_series_id,
              user_id: row.user_id
            };
          } else {
            return {
              message_id: newMessage.message_id,
              message_name: newMessage.message_name,
              message_details: newMessage.message_details,
              link: newMessage.link,
              days_from_start: newMessage.days_from_start,
              send_date: moment(row.start_date)
                .add(newMessage.days_from_start, "days")
                .format(),
              first_name: row.first_name,
              last_name: row.last_name,
              team_member_id: row.team_member_id,
              job_description: row.job_description,
              phone_number: row.phone_number,
              email: row.email,
              email_on: row.email_on,
              text_on: row.text_on,
              training_series_id: newMessage.training_series_id,
              user_id: row.user_id
            };
          }
        });

        // for each new object, insert it into the notifications table
        entriesToInsert.forEach(
          async entry => await TeamMember.addToNotificationsTable(entry)
        );
      }

      res.status(201).json({ newMessage });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT message information
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const incomingMessageUpdate = req.body;
    const updatedMessage = await Messages.update(id, incomingMessageUpdate);

    // get notification to update by message id
    const notificationsToUpdate = await Notifications.getNotificationByMessageId(
      id
    );

    // callback function to calculate new send date for notifications
    const dateRecalculation = async notification => {
      // pull in start date from relational table based on team member id and training series id
      const member = await TeamMember.getTrainingSeriesAssignment(
        notification.team_member_id,
        notification.training_series_id
      );

      const newSendDate = await moment(member.start_date)
        .add(updated_message.days_from_start, "days")
        .format("YYYY-MM-D");

      // create updated notification, including new send date if daysFromStart changed
      const updatedNotification = {
        ...incomingMessageUpdate,
        send_date: newSendDate
      };

      // update notifications
      await Notifications.updateNotificationContent(
        notification.id,
        updatedNotification
      );
    };

    // async await for each to PUT notifications with new send date
    await Notifications.asyncForEach(notificationsToUpdate, dateRecalculation);

    res.status(200).json({ updatedMessage });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET message by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const message = await Messages.findById(id);
    res.status(200).json({ message });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// DELETE message by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Messages.remove(id);
    if (deleted > 0) {
      res.status(200).json({ message: "The resource has been deleted." });
    } else {
      res.status(404).json({ error: "The resource could not be found." });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

//todo delete
// GET all messages for notification system - for server use only
router.get("/notification-system", async (req, res) => {
  try {
    const messages = await Messages.find();
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

module.exports = router;
