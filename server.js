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

//API Endpoints
server.use("/api/users", usersRouter);

//Default Endpoints
server.get("/", (req, res) => {
  res.send("It works!");
});

module.exports = server;
