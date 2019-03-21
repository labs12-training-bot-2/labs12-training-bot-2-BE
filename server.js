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
const teamsRouter = require("./routes/teamMemberRouter");
const seedRouter = require("./routes/seedRouter");

//API Endpoints
server.use("/api/seed", seedRouter);
server.use("/api/users", usersRouter);
server.use("/api/team-members", teamsRouter);

//Default Endpoints
server.get("/", (req, res) => {
  res.send("It works!");
});

module.exports = server;
