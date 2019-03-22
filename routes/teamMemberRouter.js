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

//GET a team member by teamMemberId

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

//PUT team member information
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedTeamMember = await TeamMember.update(id, req.body);
    res.status(200).json({updatedTeamMember})
  } catch(err) {
    res.status(500).json(err);
  }
})

//DELETE a team member
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await TeamMember.remove(id);
    if (deleted > 0) {
      res.status(200).json({message: "The resource has been deleted."});
    } else {
      res.status(404).json({error: "The resource could not be found."})
    }
  } catch(err) {
    res.status(500).json(err);
  }
})

module.exports = router;
