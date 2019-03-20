//Dependencies
const router = require("express").Router();

//Models
const Users = require("../database/Helpers/user-model");
//Middleware

//Routes
router.get("/", (req, res) => {
  Users.find()
    .then(users => {
      res.json({ users, decodedToken: req.decodedJwt });
    })
    .catch(err => res.send(err));
});

module.exports = router;
