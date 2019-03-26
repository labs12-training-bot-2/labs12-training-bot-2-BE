
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

// PUT post information
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedPost = await Posts.update(id, req.body);
    res.status(200).json({ updatedPost })
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET post by id
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Posts.findById(id);
    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
})

// GET post by id
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Posts.remove(id);
    if (deleted > 0) {
      res.status(200).json({ message: "The resource has been deleted." });
    } else {
      res.status(404).json({ error: "The resource could not be found." })
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
})

// GET all posts for notification system - for server use only
router.get("/notification-system", async (req, res) => {
  try {
    const posts = await Posts.find();
    res.status(200).json({ posts });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
})


module.exports = router;