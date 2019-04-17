//Dependencies
const router = require("express").Router();
const moment = require("moment");

//Models
const TeamMember = require("../database/Helpers/teamMember-model");
const TrainingSeries = require("../database/Helpers/trainingSeries-model");
const Notifications = require("../database/Helpers/notifications-model");
//Routes

// GET all team members in system (not a production endpoint)
router.get("/", async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.status(200).json({ teamMembers });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a team member by teamMemberId
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // get team member info by id
    const teamMember = await TeamMember.findById(id);

    // get team member's training series assignments
    const assignments = await TeamMember.getTrainingSeriesAssignments(id);

    res.status(200).json({ teamMember, assignments });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// POST a new team member
router.post("/", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      jobDescription,
      phoneNumber,
      userID
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !jobDescription ||
      !phoneNumber ||
      !userID
    ) {
      res.status(400).json({ error: "Client must provide all fields." });
    } else {
      const newTeamMember = await TeamMember.add(req.body);
      res.status(201).json({ newTeamMember });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT team member information
router.put("/:id", async (req, res) => {
  const { emailOn, textOn } = req.body;

  try {
    const id = req.params.id;
    const updatedTeamMember = await TeamMember.update(id, req.body);

    // build new object with accurate text / email provided based on toggle boolean
    let updatedNotificationMemberInfo;
    if (emailOn && !textOn) {
      updatedNotificationMemberInfo = {
        ...req.body,
        phoneNumber: ""
      };
    } else if (textOn && !emailOn) {
      updatedNotificationMemberInfo = {
        ...req.body,
        email: ""
      };
    } else {
      updatedNotificationMemberInfo = req.body;
    }

    // update notification table with conditional email / phone number based on textOn / emailOn
    await Notifications.updateNotificationMember(
      id,
      updatedNotificationMemberInfo
    );

    // send back updated team member information
    res.status(200).json({ updatedTeamMember });
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a team member
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await TeamMember.remove(id);
    if (deleted > 0) {
      res.status(200).json({ message: "The resource has been deleted." });
    } else {
      res.status(404).json({ error: "The resource could not be found." });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Assigns one or multiple team members to training series with the same start date
router.post("/assign", async (req, res) => {
  try {
    // store array of objects in a new variable
    const { startDate, trainingSeriesID } = req.body;
    const incomingAssignments = req.body.assignments;

    if (!startDate || !trainingSeriesID) {
      return res
        .status(400)
        .json({ error: "Start date and training series ID required." });
    }

    // for each object in array, perform a series of tasks
    incomingAssignments.forEach(async assignment => {
      try {
        const newObject = {
          startDate: startDate,
          trainingSeries_ID: trainingSeriesID,
          teamMember_ID: assignment
        };

        // 1. assign member to training series, return information
        await TeamMember.addToTrainingSeries(newObject);

        // 2. get team member info by ID
        const member = await TeamMember.findById(newObject.teamMember_ID);

        // 3. get all the posts for the training series assigned
        const posts = await TrainingSeries.getTrainingSeriesPosts(
          newObject.trainingSeries_ID
        );

        // 4. convert the integer of Post.daysFromStart into a date, assemble obj to send to Notifications table
        // generate new objects for notification table based on conditional provided
        const formattedPosts = posts.map(post => {
          if (member.emailOn && !member.textOn) {
            return {
              postID: post.postID,
              postName: post.postName,
              postDetails: post.postDetails,
              link: post.link,
              daysFromStart: post.daysFromStart,
              sendDate: moment(startDate)
                .add(post.daysFromStart, "days")
                .format(),
              teamMemberID: member.teamMemberID,
              phoneNumber: "",
              email: member.email,
              firstName: member.firstName,
              lastName: member.lastName,
              jobDescription: member.jobDescription,
              trainingSeriesID: trainingSeriesID,
              userID: member.userID
            };
          } else if (member.textOn && !member.emailOn) {
            return {
              postID: post.postID,
              postName: post.postName,
              postDetails: post.postDetails,
              link: post.link,
              daysFromStart: post.daysFromStart,
              sendDate: moment(startDate)
                .add(post.daysFromStart, "days")
                .format(),
              teamMemberID: member.teamMemberID,
              phoneNumber: member.phoneNumber,
              email: "",
              firstName: member.firstName,
              lastName: member.lastName,
              jobDescription: member.jobDescription,
              trainingSeriesID: trainingSeriesID,
              userID: member.userID
            };
          } else {
            return {
              postID: post.postID,
              postName: post.postName,
              postDetails: post.postDetails,
              link: post.link,
              daysFromStart: post.daysFromStart,
              sendDate: moment(startDate)
                .add(post.daysFromStart, "days")
                .format(),
              teamMemberID: member.teamMemberID,
              phoneNumber: member.phoneNumber,
              email: member.email,
              firstName: member.firstName,
              lastName: member.lastName,
              jobDescription: member.jobDescription,
              trainingSeriesID: trainingSeriesID,
              userID: member.userID
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
  try {
    const { id, ts_id } = req.params;
    const deleted = await TeamMember.removeFromTrainingSeries(id, ts_id);
    if (deleted > 0) {
      res.status(200).json({ message: "The resource has been deleted." });
    } else {
      res.status(404).json({ error: "The resource could not be found." });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

module.exports = router;
