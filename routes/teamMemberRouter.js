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

module.exports = router;
