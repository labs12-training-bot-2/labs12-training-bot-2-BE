//Dependencies
const router = require("express").Router();

//Models

const Users = require("../database/Helpers/user-model.js");

router.post("/register", (req, res) => {
  const { email } = req.body;

  Users.findByEmail;
});

router.post("/login", async (req, res) => {
  const { email } = req.body;
  //   console.log("EMAIL", email);
  if (!email) {
    res.status(400).json({ message: "Please include an email to login" });
  } else {
    try {
      const user = await Users.findByEmail(email);
      // Need to get training series, posts, and team members

      res.status(200).json({ message: "Login successful", user });
    } catch (error) {
      res.status(500).json({ message: "A network error occurred." });
    }
  }
});

module.exports = router;
