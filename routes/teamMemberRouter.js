//Dependencies
const router = require("express").Router();

//Models
const TeamMember = require("../database/Helpers/teamMember-model");

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
// note from Leigh-Ann: need to include training series assigned
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // get team member info by id
    const teamMember = await TeamMember.findById(id);

    // get team member's training series assignments
    const assignments = await TeamMember.getTrainingSeriesAssignments(id);
    console.log("assignments", assignments);
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
      console.log("req.body", req.body);

      // nest try catch
      await TeamMember.addToTrainingSeries(req.body);

      res
        .status(201)
        .json({
          message: "The team member has been assigned to the training series."
        });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

//Update a team member's training series start date (this route will not update the training series name)
router.put("/:id/training-series", async (req, res) => {
  try {
    const { id } = req.params;
    const { trainingSeries_ID, startDate } = req.body;

    if (!trainingSeries_ID || !startDate) {
      res.status(400).json({ message: "Client must provide all fields" });
    } else {
      const updates = await TeamMember.updateTrainingSeriesStartDate(
        id,
        trainingSeries_ID,
        startDate
      );
      console.log("updates", updates);
      res
        .status(200)
        .json({
          message: "Successfully updated team member's start date",
          updates
        });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

module.exports = router;
