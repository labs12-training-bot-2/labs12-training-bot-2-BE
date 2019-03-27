//Dependencies
const router = require("express").Router();

//Models
const Users = require("../database/Helpers/user-model.js");
const TeamMembers = require("../database/Helpers/teamMember-model");

//Middleware

//Routes
router.get("/", async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// Get All user info by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
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
    res.status(500).json({ message: "A network error occurred" });
  }
});

// GET all training series associated with user
router.get("/:id/training-series", async (req, res) => {
  try {
    const { id } = req.params;
    const userTrainingSeries = await Users.findTrainingSeriesByUser(id);
    res.status(200).json({ userTrainingSeries });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// PUT update user information

router.put("/:id", async (req, res) => {
  const changes = req.body;
  const { id } = req.params;

  try {
    const user = await Users.findById(id);

    if (!user) {
      res.status(404).json({ message: "The specified user does not exist." });
    } else {
      const updatedUser = await Users.updateUser(id, changes);

      res.status(200).json({ message: "Update successful.", updatedUser });
    }
  } catch (error) {
    res.status(500).json({ message: "A network error occurred." });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id);

    if (!user) {
      res.status(404).json({ message: "The specified user does not exist." });
    } else {
      await Users.deleteUser(id);
      res.status(200).json({ message: "User account removed successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: "A network error occurred." });
  }
});

module.exports = router;
