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
    /**
     * Get all training series associated with an authenticated user.
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */
    // Destructure the authenticated User off of res.locals
    const { user } = res.locals;
    // Get all training series from the database that are associated with the authenticated User
    const trainingSeries = await TrainingSeries.find({
      "u.email": user.email
    });
    // Return the found training series to client
    res.status(200).json({ trainingSeries });
  })
  .post(async (req, res) => {
    /**
     * create a new training series
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} req.body - The request body, which represents a new Team Member
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    //deconstructure the title and user id from the req body.
    const { title, user_id } = req.body;

    //if the title and user id isn't there send a 400 error with a message asking
    //client to provide a title and/or user id.
    if (!title && !user_id) {
      return res.status(400).json({
        error: `Client must provide: ${!title ? "-a title" : ""} ${
          !user_id ? "-a user ID" : ""
        }`
      });
    }

    //add the new training series to the database
    const newTrainingSeries = await TrainingSeries.add({ title, user_id });

    //return the newly created training series to the client.
    return res.status(201).json({ newTrainingSeries });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    /**
     * get a specific training series by it's ID
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the ID off of the request parameters
    const { id } = req.params;

    // find the training series in the database based off it's ID
    const trainingSeries = await TrainingSeries.find({ "ts.id": id }).first();

    //if the sought after training series isn't found, return a 404 and message.
    if (!trainingSeries) {
      return res.status(404).json({
        message: "sorry, we couldnt find that training series!"
      });
    }

    //Return the training series to the client
    return res.status(200).json({ trainingSeries });
  })
  .put(async (req, res) => {
    /**
     * update a specific training series in the database.
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} req.body - The request body, which represents the changes we need to make to a specific training series
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the ID off the request parameters
    const { id } = req.params;

    //if no change is made the title input, return a 400 and message.
    if (!req.body.title.length) {
      return res.status(400).json({
        message: "New title cannot be an empty string"
      });
    }
    //update the specific training series in the database
    const updatedTrainingSeries = await TrainingSeries.update(
      { "ts.id": id },
      req.body
    );

    //if the updated training series is not found, return a 404 and message.
    if (!updatedTrainingSeries) {
      return res.status(404).json({
        message: "Sorry! We couldnt find that training series!"
      });
    }
    //return the updated training series to the client
    return res.status(200).json({ updatedTrainingSeries });
  })
  .delete(async (req, res) => {
    /**
     * delete a specific training series
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the ID off of the request object
    const { id } = req.params;

    // Attempt to delete the specified Team Member from the database
    const deleted = await TrainingSeries.remove({ "ts.id": id });

    // If deleted is falsey, we can assume that there is no Team Member at that ID
    if (!deleted) {
      return res.status(404).json({
        error: "The resource could not be found."
      });
    }

    // Respond to the client with a success message
    return res.status(200).json({
      message: "The resource has been deleted."
    });
  });

router.get("/:id/messages", async (req, res) => {
  /**
   * get the messages for a specific training series
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   *
   */

  // Destructure the ID off of the request object
  const { id } = req.params;

  //find the specific training series in the database by it's ID.
  const trainingSeries = await TrainingSeries.find({ "ts.id": id });

  //if no training series is found with that ID return a 404 and message.
  if (!trainingSeries.length) {
    return res.status(404).json({
      message: "Sorry! That training series doesn't exist."
    });
  }

  //find the messages by ID
  const messages = await Messages.find({ "ts.id": id });

  //return the training series and its messages to the client
  return res.status(200).json({ trainingSeries, messages });
});

router.get("/:id/assignees", async (req, res) => {
  /**
   * get the team members for the specific training series
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructure the ID off of the request object
  const { id } = req.params;

  // Get all Messages meant for Team Members
  const messages = await Messages.find({
    "ts.id": id,
    "m.for_team_member": true
  });

  // If no Messages are found, return a 404
  if (!messages.length) {
    return res.status(404).json({
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
