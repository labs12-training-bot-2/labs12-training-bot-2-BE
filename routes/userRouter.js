//Dependencies
const router = require("express").Router();

//Models

const Users = require("../database/Helpers/user-model.js");

//Middleware

//Routes
router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.json({ users, decodedToken: req.decodedJwt });
    })
    .catch(err => res.send(err));
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    //get user by id
    const user = await Users.findById(id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      // Get Training Series by user id
      const userTrainingSeries = await Users.findTrainingSeriesByUser(id);

      // Get user account type
      const account = await Users.getUserAccountType(id);

      // Get posts by user
      const posts = await Users.getUserPosts(id);

      console.log(posts);

      res.status(200).json({ ...user, ...account, userTrainingSeries, posts });
    }
  } catch (error) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

module.exports = router;
