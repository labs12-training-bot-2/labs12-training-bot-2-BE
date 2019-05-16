//Dependencies
const router = require("express").Router();
const moment = require("moment");

//Models
const TeamMember = require("../models/db/teamMembers");
const Messages = require("../models/db/messages");
const Notifications = require("../models/db/notifications");

//Helpers
const arrayFlat = require("../helpers/arrayFlat");

// Data validation
const { teamMemberSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

// GET all team members in system (not a production endpoint)
router
  .route("/")
  .get(async (req, res) => {
    const { user } = res.locals;
    const teamMembers = await TeamMember.find({
      "u.email": user.email
    });
    res.status(200).json({ teamMembers });
  })
  .post(validation(teamMemberSchema), async (req, res) => {
    const newTeamMember = await TeamMember.add(req.body);
    return res.status(201).json({ newTeamMember });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;

    // get team member info by id
    const teamMember = await TeamMember.find({ "tm.id": id }).first();

    // get team member's training series assignments
    //const assignments = await TeamMember.getTrainingSeriesAssignments(id);

    if (!teamMember) {
      return res.status(404).json({
        message: "Sorry, but we couldnt find that team member!"
      });
    }

    return res.status(200).json({ teamMember }); //assignments
  })
  .put(validation(teamMemberSchema), async (req, res) => {
    const { id } = req.params;

    const updatedTeamMember = await TeamMember.update(id, req.body);
    return res.status(200).json({ updatedTeamMember });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const deleted = await TeamMember.remove(id);

    return deleted > 0
      ? res.status(200).json({ message: "The resource has been deleted." })
      : res.status(404).json({ message: "The resource could not be found." });
  });
router.delete("/:id/unassign/:ts_id", async (req, res) => {
  const { id, ts_id } = req.params;

  //find all messages for the specified series
  const messages = await Messages.find({
    "ts.id": ts_id,
    "m.for_team_member": true
  });

  if (!messages.length) {
    return res.status(404).json({
      message:
        "This Team Member doesn't have any messages for that Training Series."
    });
  }

  //compile list of all notifications for the given messages that are meant for specified member (array of promises)
  const pNotifs = messages.map(
    async m =>
      await Notifications.find({
        "m.id": m.id,
        "tm.id": id
      })
  );

  //resolve all promises
  const rNotifs = await Promise.all(pNotifs);

  //flatten array
  const notifsToDelete = arrayFlat(rNotifs);

  //delete each notification and send back total number of deleted items
  const totalDeleted = notifsToDelete.map(
    async n => await Notifications.remove({ "n.id": n.id })
  );
  res.status(200).json(totalDeleted.length);
});

module.exports = router;
