// Dependencies
const router = require("express").Router();

// Models
const Notifications = require("../models/db/notifications");
const Messages = require("../models/db/messages");
const TeamMembers = require("../models/db/teamMembers");
const Responses = require("../models/db/responses");

// Validation
const { notificationSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

// Routes
router
  .route("/")
  .get(async (req, res) => {
    /**
     *Get all Notifications associated with an authenticated user
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the authenticated User email from res.locals
    const { email } = res.locals.user;

    // Get all Notifications from the database that are associated with the authenticated user
    const notifications = await Notifications.find({ "u.email": email });

    // Return the found Notifications to the client
    res.status(200).json({ notifications });
  })
  .post(validation(notificationSchema), async (req, res) => {
    /**
     *Validate the request body against the Notification schema, then create a new Notification
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} req.body - The request body, represents a new Notification
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the authenticated User email from res.locals
    const { email } = res.locals.user;

    // Destructure the Message ID and Team Member ID off the request body
    const { message_id, team_member_id, recipient_id } = req.body;

    // Retrieve the Message referenced with the authenticated user by the message_id
    const messageExists = await Messages.find({
      "m.id": message_id,
      "u.email": email
    });

    // If messageExists is falsey, we can assume the Message does not exist
    if (!messageExists) {
      return res.status(404).json({ message: "That message does not exist." });
    }

    // Retrieve the Team Member referenced with the referenced user by the team_member_id
    const teamMemberExists = await TeamMembers.find({
      "tm.id": team_member_id,
      "u.email": email
    });

    // Retrieve the Team Member referenced with the authenticated user by the recipient_id
    const recipientExists = await TeamMembers.find({
      "tm.id": recipient_id,
      "u.email": email
    });

    // If teamMemberExists or recipientExists is falsey, we can assume one or both do not exist
    if (!teamMemberExists || !recipientExists) {
      return res
        .status(404)
        .json({ message: "One of those Team Members does not exist." });
    }

    // Add new Notification to the database
    const newNotification = await Notifications.add(req.body);

    // Return the newly created Notification to the client
    res.status(201).json({ newNotification });
  });

router.route("/:id").get(async (req, res) => {
  /**
   * Get a specific Notification by its ID
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructure the Notification ID from the request parameters
  const { id } = req.params;

  // Destructure the authenticated User email off of res.locals
  const { email } = res.locals.user;

  // Attempt to find the Notification in the database that relates to the authenticated user
  const notification = await Notifications.find({
    "n.id": id,
    "u.email": email
  }).first();

  notification
    ? // Return the specified Notification to the client
      res.status(200).json({ notification })
    : // If notification is falsey, we can assume either the Notification doesn't exist in the database or the user doesn't have access
      res.status(404).json({ message: "That notification does not exist." });
});

router.route("/:id/responses").get(async (req, res) => {
  /**
   * Get all Responses for a specific Notification by the Notification ID
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructure the Notification ID from the request parameters
  const { id } = req.params;

  // Destructure the authenticated User email off of res.locals
  const { email } = res.locals.user;

  // Attempt to find the Notification in the database that relates to the authenticated user
  const notification = await Notifications.find({
    "n.id": id,
    "u.email": email
  }).first();

  if (notification) {
    // If notification exists, find all Responses with the specified Notification ID
    const responses = await Responses.find({ "r.notification_id": id });

    // Return the found Responses to the client
    res.status(200).json({ responses });
  } else {
    // If notification is falsey, we can assume either the Notification doesn't exist in the database or the user doesn't have access
    res.status(404).json({ message: "That notification does not exist." });
  }
});

router.route("/:id/delete").delete(async (req, res) => {
  //todo: unknown SQL error when attempting to also pass in user.email filter to only allow deletion of logged-in user's notifications
  /**
   * Delete a specific Notification by its ID--route obfuscated to avoid accidental deletion of resource that is problematic to recreate
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructure the Notification ID from the request parameters
  const { id } = req.params;

  // Attempt to delete the specified Notification
  const deleted = await Notifications.remove({ "n.id": id });

  deleted
    ? // If deleted is a non-zero integer and truthy, respond to the client with a success message
      res.status(200).json({ message: "The notification has been deleted." })
    : // If deleted is falsey, we can assume the Notification doesn't exist in the database
      res.status(404).json({ message: "That notification does not exist." });
});

module.exports = router;
