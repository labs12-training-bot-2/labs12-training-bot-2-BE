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
    const { email } = res.locals.user;
    const messages = await Messages.find({ "u.email": email });
    res.status(200).json({ messages });
  })
  .post(validation(messageSchema), async (req, res) => {
    const { email } = res.locals.user;

    const trainingSeriesExists = await TrainingSeries.find({
      "ts.id": req.body.training_series_id,
      "u.email": email
    }).first();
    if (!trainingSeriesExists) {
      return res.status(404).json({
        message: "That training series does not exist."
      });
    }

    const newMessage = await Messages.add(req.body);
    res.status(201).json({ newMessage });
  });

router
  .route("/:id")
  .put(validation(messageSchema), async (req, res) => {
    const { id } = req.params;
    const { user } = res.locals;
    const messageExists = await Messages.find({
      "m.id": id,
      "u.email": user.email
    });
    if (!messageExists) {
      return res.status(404).json({ message: "That message does not exist." });
    }

    const updatedMessage = await Messages.update({ "m.id": id }, req.body);
    res.status(200).json({ updatedMessage });
  })
  .get(async (req, res) => {
    const { id } = req.params;
    const { user } = res.locals;
    const message = await Messages.find({
      "m.id": id,
      "u.email": user.email
    }).first();
    message
      ? res.status(200).json({ message })
      : res.status(404).json({ message: "That message does not exist" });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const { email } = res.locals.user;

    const message = await Messages.find({
      "m.id": id,
      "u.email": email
    }).first();
    if (!message) {
      return res.status(404).json({ message: "That message does not exist" });
    }

    await Messages.remove({ "m.id": id });
    res.status(200).json({ message: "The message has been deleted." });
  });

module.exports = router;
