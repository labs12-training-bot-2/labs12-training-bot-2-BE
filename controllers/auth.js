// Dependencies
const router = require("express").Router();

// Middleware
const { authentication } = require("../middleware/authentication");

// Models
const Users = require("../models/db/users");
const TrainingSeries = require("../models/db/trainingSeries");
const Token = require('../models/db/tokens');
const Service = require('../models/db/services');

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

router.route("/:service")
  .get(authentication, async (req, res) => {
    const { user } = res.locals
    const { service } = req.params

    const tokens = await Token.find({
      'u.email': user.email, 's.name': service
    });

    if (!token) {
      return res.status(404).json({
        message: "Theres no token associated with that user"
      });
    }

    return res.status(200).json(tokens);
  })
  .post(authentication, async (req, res) => {
    const { service } = req.params;
    const { id } = await Service.find({ 's.name': service });
    const { user } = await Token.add({ ...req.body, service_id: id });

    return res.status(200).json({
      message: `Token successfully created for ${user}`
    });
  })
  .delete(authentication, async (req, res) => {
    const { user } = res.locals;
    const { service } = req.params;

    const deletion = await Token.remove({ 's.name': service });

    if (!deletion) {
      return res.status(404).json({
        message: `We don't currently have a ${service} token for ${user.email}`
      })
    }
    return res.status(204).end()
  })

module.exports = router;
