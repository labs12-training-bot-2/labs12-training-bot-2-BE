//Dependencies
const router = require("express").Router();

//Models
const Responses = require("../models/db/responses");
const Notifications = require("../models/db/notifications");

//data validation
const { responseSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

router.route("/").post(validation(responseSchema), async (req, res) => {
  // we have a ref to the notification thread being sent with the post request, but not a notification_id
  const { thread, ...rest } = req.body;

  // use that thread to find the notification and grab its id
  const { id } = await Notifications.find({ "n.thread": thread }).first();

  //create a response body and pass in everything from req.body EXCEPT the thread (invalid property for response)
  //and make the found id the notification_id
  const responseBody = { ...rest, notification_id: id };
  const newResponse = await Responses.add(responseBody);
  return res.status(201).json({ newResponse });
});

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const response = await Responses.find({ "r.id": id }).first();

    if (!response) {
      return res.status(404).json({
        message: "sorry, we couldn't find that one."
      });
    }
    return res.status(200).json({ response });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const deleted = await Responses.remove(id);
    return deleted > 0
      ? res.status(200).json({ message: "The resource has been deleted." })
      : res.status(404).json({ message: "The resource could not be found." });
  });

module.exports = router;
