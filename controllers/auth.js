// Dependencies
const router = require("express").Router();

// Middleware
const { authentication } = require("../middleware/authentication");

// Models
const Users = require("../models/db/users");
const TrainingSeries = require("../models/db/trainingSeries");
const OAuth = require("../models/db/tokens");

// Routes
router.post("/", async (req, res) => {
  const { email, name } = req.body;

  const userInfo = req.body;

  if (!email) {
    res.status(400).json({ message: "Please include an email to login" });
  } else {
    try {
      const user = await Users.find({ "u.email": email }).first();

      if (user) {
        try {
          // retrieves the training series belonging to the user
          const trainingSeries = await TrainingSeries.find({ "u.id": user.id });

          res
            .status(200)
            .json({ message: "Login successful", user, trainingSeries });
        } catch (error) {
          res.status(404).json({ message: "Training series not found" });
        }
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

router
  .route("/:service/:id")
  .get(authentication, async (req, res) => {
    const { id, service } = req.params;
    try {
      const token = await OAuth.getToken(id, service);
      if (!token) {
        return res.status(404).json({
          message: "Theres no token associated with that user"
        });
      }

      return res.status(200).json(token);
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "There was a network error"
      });
    }
  })
  .post(authentication, async (req, res) => {
    const { id, service } = req.params;
    const { authToken, refreshToken, timeDiff } = req.body;
    try {
      let expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + parseInt(timeDiff));

      const [user] = await OAuth.addToken({
        id,
        service,
        authToken,
        refreshToken,
        expiration
      });

      if (!user.id) {
        return res.status(404).json({
          message: "We can't find a user at that ID"
        });
      }

      return res.status(200).json({
        message: `Token successfully created for ${user.name}`
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "There was a network error" });
    }
  })
  .delete(authentication, async (req, res) => {
    const { id, service } = req.params;
    try {
      const deletedToken = await OAuth.deleteToken(id, service);
      if (
        deletedToken[`${service}_auth_token`] ||
        deletedToken[`${service}_refresh_token`] ||
        deletedToken[`${service}_token_expiration`]
      ) {
        return res.status(404).json({
          message: "it doesn't appear that there's a user at that ID "
        });
      }
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "There was a network error " });
    }
  });

module.exports = router;
