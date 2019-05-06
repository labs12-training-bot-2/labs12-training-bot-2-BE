//Dependencies
const router = require("express").Router();
const moment = require("moment");

//Models
const TeamMember = require("../models/db/teamMembers");
const TrainingSeries = require("../models/db/trainingSeries");
const Notifications = require("../models/db/notifications");

// GET all team members in system (not a production endpoint)
router.route('/')
  .get(async (req, res) => {
    const teamMembers = await TeamMember.find();
    res.status(200).json({ teamMembers });
  })
  .post(async (req, res) => {
    const {
      first_name,
      last_name,
      job_description,
      phone_number,
      user_id
    } = req.body;

    if (
      !first_name &&
      !last_name &&
      !job_description &&
      !phone_number &&
      !user_id
    ) {
      return res.status(400).json({ error: "Client must provide all fields." });
    }

    const newTeamMember = await TeamMember.add({
      first_name,
      last_name,
      job_description,
      phone_number,
      user_id
    });
    
    return res.status(201).json({ newTeamMember });
  });

router.route('/:id')
  .get(async (req, res) => {
      const { id } = req.params;

      // get team member info by id
      const teamMember = await TeamMember.find({ 'tm.id': id });

      // get team member's training series assignments
      const assignments = await TeamMember.getTrainingSeriesAssignments(id);

      if (!teamMember) {
        return res.status(404).json({ 
          message: "Sorry, but we couldnt find that team member!" 
        });
      }
      
      return res.status(200).json({ teamMember, assignments });
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const { email_on, text_on } = req.body;
    const {
      first_name,
      last_name,
      job_description,
      email,
      phone_number,
      slack_id,
      manager,
      mentor
    } = req.body;

    if (
      !first_name &&
      !last_name &&
      !job_description &&
      !email &&
      !phone_number &&
      !slack_id &&
      !email_on &&
      !text_on &&
      !manager &&
      !mentor
    ) {
      return res.status(400).json({ 
        message: "Please supply information to be updated" 
      });
    }

    const updatedTeamMember = await TeamMember.update(id, req.body);

    // Set the notifications for the user based on email_on and text_on
    const notificationSettings = {
      ...req.body,
      ...text_on ? { phone_number } : { phone_number: "" },
      ...email_on ? { email } : { email: "" }
    }

    // Pass notification settings to Notifications model
    await Notifications.updateNotificationMember(
      id,
      notificationSettings
    );

    // send back updated team member information
    return res.status(200).json({ updatedTeamMember });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const deleted = await TeamMember.remove(id);
    
    return deleted > 0 
      ? res.status(200).json({ message: "The resource has been deleted." })
      : res.status(404).json({ message: "The resource could not be found." })
  })

// Assigns one or multiple team members to training series with the same start date
router.post("/assign", async (req, res) => {
  //--- complete per trello spec ---
  try {
    // store array of objects in a new variable
    const { start_date, training_series_id } = req.body;
    const incomingAssignments = req.body.assignments;

    if (!start_date || !training_series_id) {
      return res
        .status(400)
        .json({ error: "Start date and training series ID required." });
    }

    // for each object in array, perform a series of tasks
    incomingAssignments.forEach(async assignment => {
      try {
        const newObject = {
          start_date,
          training_series_id,
          team_member_id: assignment
        };

        // 1. assign member to training series, return information
        await TeamMember.addToTrainingSeries(newObject);

        // 2. get team member info by ID
        const member = await TeamMember.findById(newObject.team_member_id);

        // 3. get all the messages for the training series assigned
        const messages = await TrainingSeries.getTrainingSeriesPosts(
          newObject.training_series_id
        );

        // 4. convert the integer of Messages.days_from_start into a date, assemble obj to send to Notifications table
        // generate new objects for notification table based on conditional provided
        const formattedMessages = messages.map(msg => {
          if (member.email_on && !member.text_on) {
            return {
              message_id: msg.id,
              message_name: msg.message_name,
              message_details: msg.message_details,
              link: msg.link,
              days_from_start: msg.days_from_start,
              send_date: moment(start_date)
                .add(msg.days_from_start, "days")
                .format(),
              team_member_id: member.id,
              phone_number: "",
              email: member.email,
              email_on: member.email_on,
              text_on: member.text_on,
              first_name: member.first_name,
              last_name: member.last_name,
              job_description: member.job_description,
              training_series_id,
              user_id: member.user_id
            };
          } else if (member.text_on && !member.email_on) {
            return {
              message_id: msg.id,
              message_name: msg.message_name,
              message_details: msg.message_details,
              link: msg.link,
              days_from_start: msg.days_from_start,
              send_date: moment(start_date)
                .add(msg.days_from_start, "days")
                .format(),
              team_member_id: member.id,
              phone_number: member.phone_number,
              email: "",
              email_on: member.email_on,
              text_on: member.text_on,
              first_name: member.first_name,
              last_name: member.last_name,
              job_description: member.job_description,
              training_series_id,
              user_id: member.user_id
            };
          } else {
            return {
              message_id: msg.id,
              message_name: msg.message_name,
              message_details: msg.message_details,
              link: msg.link,
              days_from_start: msg.days_from_start,
              send_date: moment(start_date)
                .add(msg.days_from_start, "days")
                .format(),
              team_member_id: member.id,
              phone_number: member.phone_number,
              email: member.email,
              email_on: member.email_on,
              text_on: member.text_on,
              first_name: member.first_name,
              last_name: member.last_name,
              job_description: member.job_description,
              training_series_id,
              user_id: member.user_id
            };
          }
        });

        // 5. add each returned object to Notifications table
        // increase User.notificationCount forEach notification
        formattedPosts.forEach(
          async obj => await TeamMember.addToNotificationsTable(obj)
        );
      } catch (err) {
        res
          .status(500)
          .json({ message: "There was an error assembling the information." });
      }
    });

    res.status(201).json({
      message: "The team member has been assigned to the training series."
    });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// Remove team member from a training series
router.delete("/:id/assign/:ts_id", async (req, res) => {
    const { id, ts_id } = req.params;
    const deleted = await TeamMember.removeFromTrainingSeries(id, ts_id);
    
    if (deleted) {
      return res.status(200).json({ message: "The resource has been deleted." })
    }
});

module.exports = router;
