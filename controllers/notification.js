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

router.route("/:id").get(async (req, res) => {
  const { id } = req.params;
  const { email } = res.locals.user;
  const notification = await Notifications.find({
    "n.id": id,
    "u.email": email
  });
  notification && notification.length
    ? res.status(200).json({ notification })
    : res.status(404).json({ message: "That notification does not exist." });
});

router.route("/:id/responses").get(async (req, res) => {
  const { id } = req.params;
  const { email } = res.locals.user;

  const notification = await Notifications.find({
    "n.id": id,
    "u.email": email
  });
  if (notification && notification.length) {
    const responses = await Responses.find({ "r.notification_id": id });
    res.status(200).json({ responses });
  } else {
    res.status(404).json({ message: "That notification does not exist." });
  }
});

//client forced to go to this route specifically to make accidental deletions a smaller risk
router.route(":id/delete").delete(async (req, res) => {
  const { id } = req.params;
  const { email } = res.locals.user;

  //only delete the notification if it exists and belongs to current user, but throw 404 if either is false
  const deleted = await Notifications.remove({ "n.id": id, "u.email": email });
  deleted
    ? res.status(200).json({ message: "The notification has been deleted." })
    : res.status(404).json({ message: "That notification does not exist." });
});

module.exports = router;
