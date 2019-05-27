//Dependencies
const router = require("express").Router();

// Mail parsing
const simpleParser = require("mailparser").simpleParser;
const multer = require("multer");
const upload = multer();
const moment = require("moment");

// SMS receiving and parsing
const parseTwilio = require("express").urlencoded({ extended: false });
const MessagingResponse = require("twilio").twiml.MessagingResponse;

//Models
const Responses = require("../models/db/responses");
const Notifications = require("../models/db/notifications");

// Authentication & validation
const { authentication } = require("../middleware/authentication");
const verifySlackToken = require("../middleware/verifySlackToken");

router.route(authentication, "/").get(async (req, res) => {
  /**
   *Get all Responses for authenticated user
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructure the authenticated User email from res.locals
  const { email } = res.locals.user;

  // Retrieve all Responses from the database for the authenticated User
  const responses = await Responses.find({ "u.email": email });

  // Return Responses to the client
  res.status(200).json({ responses });
});

router
  .route(authentication, "/:id")
  .get(async (req, res) => {
    /**
     *Get a specific Response by its ID
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the Response ID from the request parameters
    const { id } = req.params;

    // Retrieve the specified Response from the database
    const response = await Responses.find({ "r.id": id }).first();

    // If response is falsey, we can assume it doesn't exist in the database
    if (!response) {
      return res.status(404).json({
        message: "sorry, we couldn't find that one."
      });
    }

    // Return the specified Response to the client
    return res.status(200).json({ response });
  })
  .delete(async (req, res) => {
    /**
     *Delete a specific Response by its ID
     *
     * @function
     * @param {Object} req - The Express request object
     * @param {Object} res - The Express response object
     * @returns {Object} - The Express response object
     */

    // Destructure the Response ID from the request parameters
    const { id } = req.params;

    // Attempt to delete the specified Response from the database
    const deleted = await Responses.remove(id);

    return deleted > 0
      ? // If deleted is greater than zero, respond to the client with a success message
        res.status(200).json({ message: "The resource has been deleted." })
      : // If deleted is falsey, we can assume the Response doesn't exist in the database
        res.status(404).json({ message: "The resource could not be found." });
  });

router.route("/email").post(upload.none(), async (req, res) => {
  /**
   *Add a body object to the request object with multer using the .none() method
   * since the endpoint only needs to handle a text-only multipart form, then
   * Create a new Response object and add it to the database
   *
   * Multer API documentation
   * @see https://www.npmjs.com/package/multer
   *
   * Mailparser API documentation
   * @see https://nodemailer.com/extras/mailparser/
   *
   * Moment.js API documentation
   * @see https://momentjs.com/
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructure the email from the request body created with multer
  const { email } = req.body;

  // Parse the raw email using simpleParser
  const { text, headerLines } = await simpleParser(email);

  // Get the unique thread identifier (the To email address)
  const thread = headerLines
    .filter(h => h.key === "to")[0]
    .line.replace("<", "")
    .replace(">", "")
    .replace("To: Training Bot ", "");

  // Attempt to find the specific Notification in the database by the thread identifier and destructure the id off of it
  const { id } = await Notifications.find({ "n.thread": thread }).first();

  // If id is falsey, we can assume the Notification with that thread identifier doesn't exist in the database
  if (!id) {
    return res
      .status(404)
      .json({ message: "That notification does not exist." });
  }

  // Pull the date off the 'date' header to split the new body text from the rest of the thread
  const dateString = headerLines
    .filter(h => h.key === "date")[0]
    .line.replace("Date: ", "");

  //Format the date with moment to match email formatting
  const formatDate = moment(dateString).format("ddd, MMMM D, YYYY");

  // Get the body text by splitting on the common RE: footer and then grabbing the first item in that new array
  const body = text.split(`On ${formatDate}\n\n`)[0];

  // Build a new Response object with the body and Notification ID retrieved from the database
  const newResponse = {
    body,
    notification_id: id
  };

  // Add the new Response object to the database
  await Responses.add(newResponse);

  // Return 204 and no content since we're responding to a webhook
  return res.status(204).end();
});

router.route("/sms").post(parseTwilio, async (req, res) => {
  /**
   * Parse the request body with Express.urlencoded method
   * Create a new Response object and add it to the database
   *
   *@see https://www.twilio.com/docs/sms/twiml/message
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Get the current date as an ISO datetime
  const now = new Date();

  // Pull Body and From off of the request body
  const { Body, From } = req.body;

  // Attempt to retrieve the Notification most recently received by the Team Member and destructure the ID
  const { id } = await Notifications.find({
    "tm.phone_number": From,
    "s.name": "twilio",
    "n.is_sent": true
  })
    .andWhere("n.send_date", "<=", now)
    .first();

  // If id is falsey, we can assume the Notification doesn't exist which we need to send an SMS response via Twilio to that effect
  if (!id) {
    const twiml = new MessagingResponse();
    const notFoundSms = twiml.message({
      body: "Sorry! We can't find which notification you're responding to."
    });

    return res
      .writeHead(200, { "Content-Type": "text/xml" })
      .end(notFoundSms.toString());
  }

  // Build a new Response object with the new Body and found Notification ID
  const newResponse = {
    body: Body,
    notification_id: id
  };

  // Add the new Response to the database
  await Responses.add(newResponse);

  // Return 204 and no content since we're responding to a webhook
  return res.status(204).end();
});

router.route("/slack").post(verifySlackToken, async (req, res) => {
  /**
   * Verify the request has a valid Slack user token with verifyToken middleware
   * then Create a new Response object and add it to the database
   *
   * Webhook for Slack responses sent here.  Cannot go in /api/slack since
   * the Slack API will not have access to a user token
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructure the challenge string from the request body
  const { challenge } = req.body;

  if (challenge) {
    // Slack sends a challenge string to verify the endpoint before it can be used
    res.status(201).json(challenge);
  } else {
    // If you don't respond within a time limit, Slack will send again
    // This results in multiple responses being logged.  Only way to avoid this would be
    // to add a column to the responses to log the ID from the event and see if it exists already
    res.status(200).end();

    // Only add Response to database if the request event denotes this was not a bot message
    if (req.body.event.subtype !== "bot_message") {
      // Destructure text and channel from the event object on the request body
      const { text, channel } = req.body.event;

      // Find all Notifications in the database by the retrieved channel string that have been marked as sent
      const notifications = await Notifications.find({
        "n.thread": channel,
        "n.is_sent": true
      });

      // Establish which of the found Notifications has the highest numerical ID value, which would be the most recently created and therefore latest
      const notification_id = Math.max(...notifications.map(n => n.id));

      // Build a new Response object with the greatest found Notification ID and the request body event text
      const newResponse = {
        notification_id,
        body: text
      };

      // Add the new Response to the database
      await Responses.add(newResponse);
    }
  }
});

module.exports = router;
