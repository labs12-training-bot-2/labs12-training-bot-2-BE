//Dependencies
const express = require("express"),
  helmet = require("helmet"),
  cors = require("cors");

//Server to point to
const server = express();

//Library Middleware
server.use(helmet(), express.json(), cors());

// twilio notification system import
const notificationSystem = require("./jobs/notifications/index");

// authentication, error and validation middleware
const { authentication } = require("./middleware/authentication");
const errorHandler = require("./middleware/errorHandling");

//Routes
const usersRouter = require("./controllers/user");
const teamsRouter = require("./controllers/teamMember");
const authRouter = require("./controllers/auth");
const trainingsRouter = require("./controllers/trainingSeries");
const messageRouter = require("./controllers/message");
const stripeRouter = require("./controllers/stripe");
const slackRouter = require("./controllers/slack");
const notificationsRouter = require("./controllers/notification");

//API Endpoints
server.use("/api/auth", authRouter);
server.use("/api/users", authentication, usersRouter);
server.use("/api/team-members", authentication, teamsRouter);
server.use("/api/training-series", authentication, trainingsRouter);
server.use("/api/messages", authentication, messageRouter);
server.use("/api/stripe", stripeRouter);
server.use("/api/slack", slackRouter);
server.use("/api/notifications", authentication, notificationsRouter);

//Default Endpoints
server.get("/", (req, res) => {
  res.send("It works!");
});

//async error handling middleware MUST come after routes or else will just throw Type error
server.use(errorHandler);

// turn on notification interval system
// notificationSystem.clearOldNotifications();
notificationSystem.resetCountOnFirstOfMonth();
notificationSystem.start();

module.exports = server;
