//Dependencies
const router = require("express").Router();
const moment = require("moment");

//Models
const TeamMember = require("../database/Helpers/teamMember-model");
const TrainingSeries = require("../database/Helpers/trainingSeries-model");
//Middleware

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

//GET a team member by teamMemberId
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
      email,
      phoneNumber,
      user_ID
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !jobDescription ||
      !email ||
      !phoneNumber ||
      !user_ID
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

//PUT team member information
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTeamMember = await TeamMember.update(id, req.body);
    res.status(200).json({ updatedTeamMember });
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE a team member
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

// Assign a team member to a training series with a start date
router.post("/:id/training-series", async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingSeries_ID, startDate } = req.body;

    if (!trainingSeries_ID || !startDate) {
      res.status(400).json({ message: "Client must provide all fields" });
    } else {
      req.body.teamMember_ID = id;

      // nest try catch - to check if team member exists?
      const assignment = await TeamMember.addToTrainingSeries(req.body);

      // get teamMember by ID
      const member = await TeamMember.findById(id);

      // need to get all the posts for the training series
      const posts = await TrainingSeries.getTrainingSeriesPosts(
        trainingSeries_ID
      );

      // send all the posts to the Notifications table and convert the integer of Post.startFromDate into a date using
      const formattedPosts = posts.map(post => {
        return {
          postName: post.postName,
          postDetails: post.postDetails,
          link: post.link,
          sendDate: moment(assignment.startDate)
            .add(post.daysFromStart, "days")
            .format(),
          phoneNumber: member.phoneNumber,
          email: member.email,
          firstName: member.firstName,
          lastName: member.lastName
        };
      });

      console.log(formattedPosts);
      
      // add each returned object to Notifications table
      formattedPosts.forEach(async obj => await TeamMember.addToNotificationsTable(obj))

      // need to get all the posts for the training series

      // send all the posts to the Notifications table and convert the integer of Post.startFromDate into a date using moment.js (use forEach)
      // colums are sendDate, postName, postDetails, link, phoneNumber, email, firstName, lastName (name is nullable)

      res.status(201).json({
        message: "The team member has been assigned to the training series."
      });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

//Update a team member's training series start date (this route will not update the training series to which they are assigned)
router.put("/:id/training-series/:ts_id", async (req, res) => {
  try {
    const { id, ts_id } = req.params;
    const { startDate } = req.body;

    if (!startDate) {
      res.status(400).json({ message: "Client must provide all fields" });
    } else {
      const updates = await TeamMember.updateTrainingSeriesStartDate(
        id,
        ts_id,
        startDate
      );
      console.log("updates", updates);
      res.status(200).json({
        message: "Successfully updated team member's start date",
        updates
      });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

router.delete("/:id/training-series/:ts_id", async (req, res) => {
  try {
    const { id, ts_id } = req.params;
    const deleted = await TeamMember.removeFromTrainingSeries(id, ts_id);
    console.log("deleted", deleted);
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
