
// Dependencies 
const router = require('express').Router();

// Models
const Posts = require('../database/Helpers/post-model')

// existing models findById, add, update, remove

// POST a new post
router.post("/", async (req, res) => {
  try {
    const { postName, postDetails, link, startDate, trainingSeriesID } = req.body;

    if (!postName || !postDetails || !link || !startDate || !trainingSeriesID) {
      res.status(400).json({ error: "Client must provide all fields." })
    } else {
      const newPost = await Posts.add(req.body);
      res.status(201).json({ newPost });
    }
  } catch (err) {
    res.status(500).json(err);
  }
})


module.exports = router;