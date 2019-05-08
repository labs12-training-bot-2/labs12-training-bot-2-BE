// Dependencies
const router = require("express").Router();

// Models
const Notifications = require("../models/db/notifications");
const Messages = require("../models/db/messages");
const TeamMembers = require("../models/db/teamMembers");

// Validation
const { notificationSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

// Routes
router
  .route("/")
  .get(async (req, res) => {
    const { email } = res.locals.user;
    const notifications = await Notifications.find({ "u.email": email });
    res.status(200).json({ notifications });
  })
  .post(validation(notificationSchema), async (req, res) => {
    const { email } = res.locals.user;
    const { message_id, team_member_id } = req.body;

    const messageExists = await Messages.find({
      "m.id": message_id,
      "u.email": email
    });
    if (!messageExists) {
      return res.status(404).json({ message: "That message does not exist." });
    }

    const teamMemberExists = await TeamMembers.find({
      "tm.id": team_member_id,
      "u.email": email
    });
    if (!teamMemberExists) {
      return res.status(404).json({ message: "That message does not exist." });
    }

    const newNotification = await Notifications.add(req.body);
    res.status(201).json({ newNotification });
  });

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const { email } = res.locals.user;
    const notification = await Notifications.find({
      "n.id": id,
      "u.email": email
    });
    notification && notification.length
      ? res.status(200).json({ notification })
      : res.status(404).json({ message: "That notification does not exist." });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const deleted = await Notifications.remove({ "n.id": id });
    deleted
      ? res.status(200).json({ message: "The notification has been deleted." })
      : res.status(404).json({ message: "That notification does not exist." });
  });

//client forced to go to this route specifically to lower risks of accidentally batch deleting when in /:id
router.route("/delete").delete(async (req, res) => {
  const { email } = res.locals.user;
  //? what filters do users need to batch delete by?
  //? if all of their notifications, will need to perform joins in model to gain access to u.email
  const deleted = await Notifications.remove({});
});

module.exports = router;
