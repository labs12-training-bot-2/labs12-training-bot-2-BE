//Dependencies
const router = require("express").Router();

const { createFakeUsers } = require("./teamMember_FakeData");

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

router.post("/", (req, res) => {
  // Creates 10 fake team members
  const teamMembers = createFakeUsers();

  TeamMember.add(createFakeUsers())
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
