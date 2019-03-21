//Dependencies
const router = require("express").Router();

//Models

const Users = require("../database/Helpers/user-model.js");

router.post("/register", (req, res) => {
  const { email } = req.body;

  Users.findByEmail;
});

router.post("/login", (req, res) => {
  const { email } = req.body;

  Users.findByEmail;
});

module.exports = router;
