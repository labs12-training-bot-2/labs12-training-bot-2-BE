//Dependencies
const router = require("express").Router();

//Models
const TeamMembers = require('../database/Helpers/teamMember-model.js');

const TeamMember = require("../database/Helpers/teamMember-model");

//Middleware

//Routes

// GET all team members in system
router.get("/", async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.status(200).json({ teamMembers });
  } catch(err) {
    res.status(500).json(err);
  }
});

// POST a new team member
router.post("/", async (req, res) => {
  try {
    const { firstName, lastName, jobDescription, email, phoneNumber, user_ID } = req.body;
    
    if (!firstName || !lastName || !jobDescription || !email || !phoneNumber || !user_ID ) {
      res.status(400).json({error: "Client must provide all fields."})
    } else {
      const newTeamMember = await TeamMember.add(req.body);
      res.status(201).json({ newTeamMember });
    }
  } catch(err) {
    res.status(500).json(err);
  }
})

module.exports = router;
