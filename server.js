//Dependencies
const express = require("express"),
  helmet = require("helmet"),
  cors = require("cors");

//Server to point to
const server = express();

//Library Middleware
server.use(helmet(), express.json(), cors());

//Routes
const usersRouter = require("./routes/userRouter");
const teamMemberRouter = require("./routes/teamMemberRouter");

//API Endpoints
server.use("/api/users", usersRouter);
server.use("/api/team-members", teamMemberRouter);

//Default Endpoints
server.get("/", (req, res) => {
  res.send("It works!");
});

module.exports = server;
