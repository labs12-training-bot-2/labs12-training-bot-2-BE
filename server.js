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

// authentication and error middleware
const { authenticate } = require("./middleware/authentication");
const errorHandler = require("./middleware/errorHandling");

//Routes
const usersRouter = require("./controllers/user");
const teamsRouter = require("./controllers/teamMember");
const authRouter = require("./controllers/auth");
const trainingsRouter = require("./controllers/trainingSeries");
const messageRouter = require("./controllers/message");
const stripeRouter = require("./controllers/stripe");
const slackRouter = require("./controllers/slack");

//API Endpoints
server.use("/api/auth", authRouter);
server.use("/api/users", authenticate, usersRouter);
server.use("/api/team-members", authenticate, teamsRouter);
server.use("/api/training-series", authenticate, trainingsRouter);
server.use("/api/messages", authenticate, messageRouter);
server.use("/api/stripe", stripeRouter);
//server.use('/api/slack', slackRouter);

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
