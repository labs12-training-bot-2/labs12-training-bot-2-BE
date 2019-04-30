// Dependencies
const router = require("express").Router();

// Middleware
const { authenticate } = require('../auth/authenticate');

// Models
const Users = require("../database/Helpers/user-model.js");
const OAuth = require('../database/Helpers/oauth-model');

// Routes
router.post("/", async (req, res) => {
  const { email, name } = req.body;

  const userInfo = req.body;

  if (!email) {
    res.status(400).json({ message: "Please include an email to login" });
  } else {
    try {
      const user = await Users.findByEmail(email);

      if (user) {
        try {
          // retrieves the training series belonging to the user
          const trainingSeries = await Users.findTrainingSeriesByUser(user.id);

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

router.route('/:service/:id')
  .get(authenticate, async (req, res) => {
    const { id, service } = req.params;
    try {
      const token = await OAuth.getToken(id, service);
      if (!token) {
        return res.status(404).json({
          message: 'Theres no token associated with that user'
        })
      }

      return res.status(200).json(token);
    }
    catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "There was a network error"
      })
    }
  })
  .post(authenticate, async (req, res) => {
    const { id, service } = req.params;
    const { authToken, refreshToken, timeDiff } = req.body
    try {
      let expiration = new Date;
      expiration.setSeconds(expiration.getSeconds() + parseInt(timeDiff));

      const [ user ] = await OAuth.addToken({
        id, service, authToken, refreshToken, expiration
      })

      if (!user.id) {
        return res.status(404).json({
          message: "We can't find a user at that ID"
        })
      }

      return res.status(200).json({
        message: `Token successfully created for ${user.name}`
      })
    }
    catch (err) {
      console.log(err)
      return res.status(500).json({ message: "There was a network error" })
    }
  })

module.exports = router;
