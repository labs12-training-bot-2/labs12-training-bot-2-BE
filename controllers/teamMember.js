// Dependencies
const router = require("express").Router();

// Models
const TeamMember = require("../models/db/teamMembers");
const Messages = require("../models/db/messages");
const Notifications = require("../models/db/notifications");

// Helpers
const arrayFlat = require("../helpers/arrayFlat");

// Data validation
const { teamMemberSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

router
  .route("/")
  .get(async (req, res) => {
    /**
     * Get all Team Members associated with an authenticated user
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the authenticated User email off of res.locals
    const { email } = res.locals.user;

    // Get all Team Members from the database that are associated with the authenticated User
    const teamMembers = await TeamMember.find({
      "u.email": email
    });

    // Return the found Team Members to client
    return res.status(200).json({ teamMembers });
  })
  .post(validation(teamMemberSchema), async (req, res) => {
    /**
     * Validate the request body against our Team Member schema and then Create
     * a new Team Member
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} req.body - The request body, which represents a new Team Member
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Add the new Team Member to the database
    const newTeamMember = await TeamMember.add(req.body);

    // Return the newly created Team Member to the client
    return res.status(201).json({ newTeamMember });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    /**
     * Get a specific Team Member by their ID
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the ID off of the request parameters
    const { id } = req.params;

    // Destructure the authenticated User email off of res.locals
    const { email } = res.locals.user;

    // Get the Team Member associated with a user by ID
    const teamMember = await TeamMember.find({
      "tm.id": id,
      "u.email": email
    }).first();

    // If teamMember is falsey, we can assume that Team Member doesn't exist
    if (!teamMember) {
      return res.status(404).json({
        message: "Sorry, but we couldnt find that team member!"
      });
    }

    // Return the Team Member to the client
    return res.status(200).json({ teamMember });
  })
  .put(validation(teamMemberSchema), async (req, res) => {
    /**
     * Validate the request body against the Team Member schema, then update
     * the specified Team Member in the database
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} req.body - The request body, which represents the changes we need to make to a specific Team Member
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the ID off the request parameters
    const { id } = req.params;

    // Update the specific team member in the database
    const updatedTeamMember = await TeamMember.update(
      { "tm.id": id },
      req.body
    );

    // Return the updated Team Member to the client
    return res.status(200).json({ updatedTeamMember });
  })
  .delete(async (req, res) => {
    /**
     * Delete a specified Team Member
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the ID off of the request object
    const { id } = req.params;

    // Attempt to delete the specified Team Member from the database
    const deleted = await TeamMember.remove({ "tm.id": id });

    // If deleted is falsey, we can assume that there is no Team Member at that ID
    if (!deleted) {
      return res.status(404).json({
        message: "The resource could not be found."
      });
    }

    // Respond to the client with a success message
    return res.status(200).json({
      message: "The resource has been deleted."
    });
  });

router.delete("/:id/unassign/:ts_id", async (req, res) => {
  /**
   * "Unassign" a specific Team Member from a specific Training Series.
   * Ultimately, this deletes all pending notifications for that Team Member
   * that are associated with a particular Training Series.
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructure the Team Member ID and Training Series ID off of the request object
  const { id, ts_id } = req.params;

  // Find all Messages associated with the specified Training Series
  const messages = await Messages.find({
    "ts.id": ts_id
  });

  // If messages.length is falsey, we can assume that that Team Member hasn't
  // been assigned to that training series.
  if (!messages.length) {
    return res.status(404).json({
      message:
        "This Team Member doesn't have any messages for that Training Series."
    });
  }

  // Compile a list of all pending Notifications associated with a Training
  // Series for that Team Member, based on the messages found above. This will
  // be an array of Promises
  const pNotifs = messages.map(
    async m =>
      await Notifications.find({
        "m.id": m.id,
        "tm.id": id
      })
  );

  // Resolve all Promises in that array
  const rNotifs = await Promise.all(pNotifs);

  // Flatten all nested arrays inside of rNotifs
  const notifsToDelete = arrayFlat(rNotifs);

  // Delete each notification and send back total number of deleted items,
  // along with array of deleted ids to send to the client
  const totalDeleted = notifsToDelete.map(
    async n => await Notifications.remove({ "n.id": n.id })
  );

  // If totalDeleted.length is falsey, we can assume that there were no pending
  // Notifications for that Team Member associated with that Training Series
  if (!totalDeleted.length) {
    return res.status(404).json({
      message:
        "This Team Member doesn't have any Notifications for that Training Series."
    });
  }

  // Respond to the client with the number of resources deleted and the ID's of
  // the deleted notifications
  return res.status(200).json({
    message: `${totalDeleted.length} resource(s) deleted.`,
    ids: notifsToDelete.map(n => n.id)
  });
});

module.exports = router;
