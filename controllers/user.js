//Dependencies
const router = require("express").Router();

//Models
const Users = require("../models/db/users");
const TeamMembers = require("../models/db/teamMembers");
const Notifications = require("../models/db/notifications");

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
      try {
        // Get Training Series by user id
        const userTrainingSeries = await Users.findTrainingSeriesByUser(id);
        // Get user account type
        const account = await Users.getUserAccountType(id);
        // Get messages by user
        const messages = await Users.getUserMessages(id);
        const members = await TeamMembers.findBy({ user_id: id });

        const userInfo = {
          ...user,
          ...account,
          members,
          userTrainingSeries,
          messages
        };

        res.status(200).json(userInfo);
      } catch (error) {
        res.status(500).json({
          message:
            "A network error occurred while attempting to retrieve that user's info"
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      message: "A network error occurred while attempting to retrieve that user"
    });
  }
});

// GET all members associated with user
router.get("/:id/team-members", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const members = await TeamMembers.findBy({ user_id: id });
      res.status(200).json({ members });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// GET all training series associated with user
router.get("/:id/training-series", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const userTrainingSeries = await Users.findTrainingSeriesByUser(id);
      res.status(200).json({ userTrainingSeries });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// GET all text notifications associated with user
router.get("/:id/text-notifications", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const textNotifications = await Notifications.getTextNotifications(id);
      res.status(200).json({ textNotifications });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// GET all email notifications associated with user
router.get("/:id/email-notifications", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      const emailNotifications = await Notifications.getEmailNotifications(id);
      res.status(200).json({ emailNotifications });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// PUT update user information
router.put("/:id", async (req, res) => {
  const { name, email, stripe, notification_count, account_type_id } = req.body;
  // at least one user field must be submitted for PUT request
  if (!name && !email && !stripe && !notification_count && !account_type_id) {
    return res
      .status(400)
      .json({ message: "Supply at least one user field to be updated." });
  }
  // only supported user fields will be inserted as changes--no SQL injections
  const changes = { name, email, stripe, notification_count, account_type_id };
  const { id } = req.params;
  try {
    const user = await Users.findById(id);
    if (!user) {
      res.status(404).json({ message: "The specified user does not exist." });
    } else {
      const [updatedUser] = await Users.updateUser(id, changes);
      res.status(200).json({ message: "Update successful.", updatedUser });
    }
  } catch (error) {
    res.status(500).json({ message: "A network error occurred." });
  }
});

// DELETE a user account
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Users.deleteUser(id);
    !deleted
      ? res.status(404).json({ message: "The specified user does not exist." })
      : res.status(200).json({ message: "User account removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "A network error occurred." });
  }
});

module.exports = router;
