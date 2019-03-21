//Dependencies
const router = require("express").Router();

const { createFakeTeamMembers } = require("../database/seeds/fakeData");

//Models

const TeamMember = require("../database/Helpers/teamMember-model");

//Middleware

//Routes
router.get("/", (req, res) => {
  TeamMember.find()
    .then(teamMembers => {
      res.json({ teamMembers, decodedToken: req.decodedJwt });
    })
    .catch(err => res.send(err));
});

// Endpoint to create 10 fake team members
router.post("/create-fake-members", (req, res) => {
  // Creates 10 fake team members

  TeamMember.add(createFakeTeamMembers())
    .then(teamMembers => {
      res
        .status(201)
        .json({ message: "Team Members added successfully", teamMembers });
    })
    .catch(
      res.status(500).json({ message: "There was an error with the network" })
    );
});

module.exports = router;
