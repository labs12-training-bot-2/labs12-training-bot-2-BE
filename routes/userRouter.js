//Dependencies
const router = require("express").Router();

//Models
const Users = require("../database/Helpers/user-model.js");
const TeamMembers = require("../database/Helpers/teamMember-model");

//Middleware

//Routes
router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.json({ users, decodedToken: req.decodedJwt });
    })
    .catch(err => res.send(err));
});

// Get All user info by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    //get user by id
    const user = await Users.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      // Get Training Series by user id
      const userTrainingSeries = await Users.findTrainingSeriesByUser(id);

      // Get user account type
      const account = await Users.getUserAccountType(id);

      // Get posts by user
      const posts = await Users.getUserPosts(id);

      const members = await TeamMembers.findBy({ user_ID: id });
      console.log(members);

      const userInfo = {
        ...user,
        ...account,
        members,
        userTrainingSeries,
        posts
      };

      res.status(200).json(userInfo);
    }
  } catch (error) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// GET all members associated with user
router.get("/:id/team-members", async (req, res) => {
  try {
    const userId = req.params.id;
    const members = await TeamMembers.findBy({ user_ID: userId });
    res.status(200).json({ members });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
