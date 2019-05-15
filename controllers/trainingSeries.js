//Dependencies
const router = require("express").Router();
const arrayFlat = require("../helpers/arrayFlat");

//Models
const TrainingSeries = require("../models/db/trainingSeries");
const Messages = require("../models/db/messages");
const Notifications = require("../models/db/notifications");

router
  .route("/")
  .get(async (req, res) => {
    const { user } = res.locals;
    const trainingSeries = await TrainingSeries.find({
      "u.email": user.email
    });
    res.status(200).json({ trainingSeries });
  })
  .post(async (req, res) => {
    const { title, user_id } = req.body;

    if (!title && !user_id) {
      return res.status(400).json({
        error: `Client must provide: ${!title ? "-a title" : ""} ${
          !user_id ? "-a user ID" : ""
        }`
      });
    }

    const newTrainingSeries = await TrainingSeries.add({ title, user_id });

    return res.status(201).json({ newTrainingSeries });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const trainingSeries = await TrainingSeries.find({ "ts.id": id }).first();

    if (!trainingSeries) {
      return res.status(404).json({
        message: "sorry, we couldnt find that training series!"
      });
    }

    return res.status(200).json({ trainingSeries });
  })
  .put(async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    if (!changes.title.length) {
      return res.status(400).json({
        message: "New title cannot be an empty string"
      });
    }

    const updatedTrainingSeries = await TrainingSeries.update(id, changes);

    if (!updatedTrainingSeries) {
      return res.status(404).json({
        message: "Sorry! We couldnt find that training series!"
      });
    }

    return res.status(200).json({ updatedTrainingSeries });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const deleted = await TrainingSeries.remove(id);

    if (!deleted) {
      return res.status(404).json({
        error: "The resource could not be found."
      });
    }

    return res.status(200).json({
      message: "The resource has been deleted."
    });
  });

router.get("/:id/messages", async (req, res) => {
  const { id } = req.params;

  const trainingSeries = await TrainingSeries.find({ "ts.id": id });

  if (!trainingSeries.length) {
    return res.status(404).json({
      message: "Sorry! That training series doesn't exist."
    });
  }

  const messages = await Messages.find({ "ts.id": id });

  return res.status(200).json({ trainingSeries, messages });
});

router.get("/:id/assignees", async (req, res) => {
  const { id } = req.params;

  // Get all Messages meant for Team Members
  const messages = await Messages.find({
    "ts.id": id,
    "m.for_team_member": true
  });

  // If no Messages are found, return a 404
  if (!messages.length) {
    return res
      .status(404)
      .json({
        message: "This Training Series has no messages meant for Team Members"
      });
  }

  // Create an array of pending promises for each
  // notification matching a message
  const pAssignees = messages.map(
    async m =>
      await Notifications.find({
        "m.id": m.id
      })
  );

  // Resolve all promises in the pAssignees array
  const rAssignees = await Promise.all(pAssignees);

  // Recursively flatten the array 
  const assignedTeamMembers = arrayFlat(rAssignees);

  // Return the assigned Team Members to the client
  return res.status(200).json({ assignedTeamMembers });
});

module.exports = router;
