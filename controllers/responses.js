//Dependencies
const router = require("express").Router();

// Mail parsing
const simpleParser = require("mailparser").simpleParser;
const multer = require("multer");
const upload = multer();
const moment = require("moment");

//Models
const Responses = require("../models/db/responses");
const Notifications = require("../models/db/notifications");

// Authentication & validation
const { authentication } = require("../middleware/authentication");


router.route(authentication, "/:id")
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

router.route("/email")
  .post(upload.none(), async (req, res) => {
    // Parse the raw email from req.body using multer and simpleParser
    const { email } = req.body;
    const { text, headerLines } = await simpleParser(email);

    // Get the unique thread identifier (the To email address)
    const thread = headerLines
      .filter(h => h.key === "to")[0]
      .line.replace("<", "")
      .replace(">", "")
      .replace("To: Training Bot ", "");

    // use that thread identifier to find the notification and grab its id
    const { id } = await Notifications.find({ "n.thread": thread }).first();

    // Pull the date off the 'date' header to split the new body text 
    // from the rest of the thread. Format it with moment to match 
    // email formatting
    const dateString = headerLines
      .filter(h => h.key === "date")[0]
      .line.replace("Date: ", "");
    const formatDate = moment(dateString).format("ddd, MMMM D, YYYY");

    // get the body text by spliting on the common RE footer and
    // then grabbing the first item in that new array
    const body = text.split(`On ${formatDate}\n\n`)[0];

    // build a response object with the thread and the body
    const resObject = {
      body,
      notification_id: id
    };

    // Add the newResponse object to the responses table
    const newResponse = await Responses.add(resObject);

    // Return 204 and no content (since I'm responding to a webhook)
    return res.status(204).end();
  });

module.exports = router;
