//Dependencies
const router = require("express").Router();

//Models

const Users = require("../database/Helpers/user-model.js");

router.post("/", async (req, res) => {
  const { email, name } = req.body;

  const userInfo = req.body;

  if (!email) {
    res.status(400).json({ message: "Please include an email to login" });
  } else {
    try {
      const user = await Users.findByEmail(email);

      if (user) {
        res.status(200).json({ message: "Login successful", user });
      } else if (!user && !name) {
        // Check if user exists,
        // If user doesn't exist, must include a name
        res.status(400).json({
          message: "Please include a name to create an account."
        });
      } else {
        // add user to the db and return the user id
        const newUser = await Users.add(userInfo);

        return res
          .status(201)
          .json({ message: "Account created Successfully", newUser });
      }
    } catch (error) {
      res.status(500).json({ message: "A network error occurred." });
    }
  }
});

module.exports = router;
