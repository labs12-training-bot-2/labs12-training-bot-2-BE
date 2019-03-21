//Dependencies
const router = require("express").Router();

const {
  createFakeTeamMembers,
  createFakeUsers
} = require("../database/seeds/fakeData");

//Models

const TeamMember = require("../database/Helpers/teamMember-model");
const Users = require("../database/Helpers/user-model");

// Endpoint to create 10 fake team members
router.post("/team-members", (req, res) => {
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

// Endpoint to create fake user datate
router.post("/users", (req, res) => {
  // Creates 10 fake users
  const newUsers = createFakeUsers();
  console.log(newUsers);

  Users.add(newUsers)
    .then(users => {
      res.status(201).json({ message: "Users added successfully", users });
    })
    .catch(
      res.status(500).json({ message: "There was an error with the network" })
    );
});

module.exports = router;
