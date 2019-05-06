// Dependencies
const router = require("express").Router();
const moment = require("moment");

// Models
const Messages = require("../models/db/messages");
const Notifications = require("../models/db/notifications");
const TeamMember = require("../models/db/notifications");
const TrainingSeries = require("../models/db/trainingSeries");

// Routes
// POST a new message
router.post("/", async (req, res) => {
  try {
    const {
      message_name,
      message_details,
      days_from_start,
      training_series_id,
      link //optional
    } = req.body;

    if (
      !message_name ||
      !message_details ||
      !days_from_start ||
      !training_series_id
    ) {
      res.status(400).json({ error: "Client must provide all fields." });
    } else {
      // see if the training series the new message belongs to exists
      const [trainingSeriesExists] = await TrainingSeries.findById(
        training_series_id
      );
      if (!trainingSeriesExists) {
        return res.status(404).json({
          message: "The training series with that id does not exist."
        });
      }
      // add new message to database
      //but only the fields we want added (no injections)
      const msg = {
        message_name,
        message_details,
        days_from_start,
        training_series_id,
        link: link ? link : "" //if non-null link was not supplied, adds as empty string
      };
      const [newMessage] = await Messages.add(msg);
      //see if new message's training series already has assignments for team members
      const rows = await Notifications.getTrainingSeriesAssignmentsOfNewMessage(
        training_series_id
      );

      // if it does, for each assignment per team member id, assemble a new object to be inserted to the notifications table with the new message information
      // generate new object to update the notification table based on updated conditional

      if (rows.length > 0) {
        const entriesToInsert = rows.map(row => {
          // locally-scoped object allows for MUCH shorter code in this .map
          // previously was entirely repeated for each conditional case, even though only phone# and email would be different on the returned object
          const newNotification = {
            send_date: moment(row.start_date)
              .add(newMessage.days_from_start, "days")
              .format(),
            message_name: newMessage.message_name,
            message_details: newMessage.message_details,
            link: newMessage.link,
            phone_number: "",
            email: "",
            first_name: row.first_name,
            last_name: row.last_name,
            message_id: newMessage.message_id,
            team_member_id: row.id,
            days_from_start: newMessage.days_from_start,
            job_description: row.job_description,
            training_series_id: newMessage.training_series_id,
            user_id: row.user_id,
            text_sent: false,
            email_sent: false,
            email_on: row.email_on,
            text_on: row.text_on
          };

          if (row.email_on && !row.text_on) {
            newNotification.email = row.email;
            return newNotification;
          } else if (row.text_on && !row.email_on) {
            newNotification.phone_number = row.phone_number;
            return newNotification;
          } else {
            newNotification.email = row.email;
            newNotification.phone_number = row.phone_number;
            return newNotification;
          }
        });

        // for each new object, insert it into the notifications table
        Notifications.asyncForEach(entriesToInsert, entry =>
          TeamMember.addToNotificationsTable(entry)
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
    const { id } = req.params;

    const {
      message_name,
      message_details,
      days_from_start,
      training_series_id,
      link
    } = req.body;

    if (
      !message_name &&
      !message_details &&
      !days_from_start &&
      !training_series_id &&
      !link
    ) {
      return res
        .status(400)
        .json({ error: "Client must provide at least one field to change." });
    }

    const [updatedMessage] = await Messages.update(id, req.body);
    if (!updatedMessage || !updatedMessage.length) {
      return res.status(404).json({ message: "That message does not exist." });
    }
    // get list of notifications to update by message id
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

      if (member) {
        //only perform the following operations if the notification relates to a valid team member assigned to a valid series, with the relationship defined in relational_table
        //essentially will only fail at this point if data was seeded and not completely linked properly
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
      }
    };

    // async await for each to PUT notifications with new send date
    // but fires ONLY if there are actually any notifications to update
    if (notificationsToUpdate.length) {
      await Notifications.asyncForEach(
        notificationsToUpdate,
        dateRecalculation
      );
    }
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
    message && message.length
      ? res.status(200).json({ message })
      : res.status(404).json({ message: "Message does not exist" });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// DELETE message by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Messages.remove(id);
    deleted
      ? res.status(200).json({ message: "The resource has been deleted." })
      : res.status(404).json({ error: "The resource could not be found." });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

//todo: marked for deletion, pending verification that we don't need this anywhere
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
