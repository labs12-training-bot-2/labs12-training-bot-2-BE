// Dependencies
const router = require("express").Router();

// Models
const Messages = require("../models/db/messages");
const TrainingSeries = require("../models/db/trainingSeries");

// Data validation
const { messageSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

// Routes
router
  .route("/")
  .get(async (req, res) => {
    /**
     *Get all Messages associated with an authenticated user
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the authenticated User email from res.locals
    const { email } = res.locals.user;

    // Get all Messages from the database that are associated with the authenticated user
    const messages = await Messages.find({ "u.email": email });

    // Return the found Messages to the client
    res.status(200).json({ messages });
  })
  .post(validation(messageSchema), async (req, res) => {
    /**
     * Validate the request body against the Message schema, then create a new Message
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} req.body - The request body, represents a new Message
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the authenticated User email from res.locals
    const { email } = res.locals.user;

    // Retrieve the Training Series referenced with the authenticated user by the training_series_id
    const trainingSeriesExists = await TrainingSeries.find({
      "ts.id": req.body.training_series_id,
      "u.email": email
    }).first();

    // If trainingSeriesExists is falsey, we can assume the Training Series does not exist
    if (!trainingSeriesExists) {
      return res.status(404).json({
        message: "That training series does not exist."
      });
    }

    // Add new Message to the database
    const newMessage = await Messages.add(req.body);

    // Return newly created Message to the client
    res.status(201).json({ newMessage });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    /**
     * Get a specific Message by its ID
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the Message ID from the request parameters
    const { id } = req.params;

    // Destructure the authenticated User email off of res.locals
    const { email } = res.locals.user;

    // Get the Message associated with the user by ID
    const message = await Messages.find({
      "m.id": id,
      "u.email": email
    }).first();

    message
      ? // Return the specified Message to the client
        res.status(200).json({ message })
      : // If message is falsey, either the Message doesn't exist in the database or the user doesn't have access
        res.status(404).json({ message: "That message does not exist" });
  })
  .put(validation(messageSchema), async (req, res) => {
    /**
     * Validate the request body against the Message schema, then update
     * the specified Team Member in the database
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @param {Object} req.body - The request body, which represents the changes to be made on a specified Message
     * @returns {Object} - The Express response object
     */

    // Destructure the ID off the request parameters
    const { id } = req.params;

    // Destructure the authenticated User email from res.locals
    const { email } = res.locals.user;

    // Attempt to find the Message in the database that relates to the authenticated user
    const messageExists = await Messages.find({
      "m.id": id,
      "u.email": email
    });

    // If messageExists is falsey, either the Message does not exist in the database or the authenticated user does not have access to it
    if (!messageExists) {
      return res.status(404).json({ message: "That message does not exist." });
    }

    // Update the specified Message in the database
    const updatedMessage = await Messages.update({ "m.id": id }, req.body);

    // Return the newly updated Message to the client
    res.status(200).json({ updatedMessage });
  })
  .delete(async (req, res) => {
    /**
     * Delete a specific Message by its ID
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the Message ID from the request parameters
    const { id } = req.params;

    // Destructure the authenticated User email off of res.locals
    const { email } = res.locals.user;

    // Get the Message associated with the user by ID
    const message = await Messages.find({
      "m.id": id,
      "u.email": email
    }).first();

    // If message is falsey, either the Message doesn't exist in the database or the user doesn't have access
    if (!message) {
      return res.status(404).json({ message: "That message does not exist" });
    }

    // Attempt to delete the specified Message
    await Messages.remove({ "m.id": id });

    // Respond to the client with a success message
    res.status(200).json({ message: "The message has been deleted." });
  });

module.exports = router;
