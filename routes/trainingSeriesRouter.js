//Dependencies
const router = require("express").Router();

//Models
const TrainingSeries = require('../database/Helpers/trainingSeries-model');

//Routes

// GET all training series (not a production endpoint)
router.get("/", async (req, res) => {
    try {
        const trainingSeries = await TrainingSeries.find();
        res.status(200).json({ trainingSeries });
      } catch(err) {
        res.status(500).json({ message: "A network error occurred" });
      }
})

// GET all posts (not a production endpoint)
router.get("/posts", async (req, res) => {
    try {
        const posts = await TrainingSeries.getAllPosts();
        res.status(200).json({ posts });
    } catch(err) {
       res.status(500).json({ message: "A network error occurred" }); 
    }
})

// GET training series by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const trainingSeries = await TrainingSeries.findById(id);
        res.status(200).json({ trainingSeries });
    } catch(err) {
        res.status(500).json({ message: "A network error occurred" })
    }
})

// POST a new training series
router.post("/", async (req, res) => {
    try {
        const { title, userID } = req.body;

        if ( !title || !userID ) {
            res.status(400).json({ error: "Client must provide all fields." })
        } else {
            const newTrainingSeries = await TrainingSeries.add(req.body);
            res.status(201).json({ newTrainingSeries });
        }
    } catch(err) {
        res.status(500).json({ message: "A network error occurred" });
    }
})

// PUT training series information
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTrainingSeries = await TrainingSeries.update(id, req.body);
        res.status(200).json({ updatedTrainingSeries });
    } catch(err) {
        res.status(500).json({ message: "A network error occurred" })
    }
})

// DELETE a training series
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TrainingSeries.remove(id);
        if (deleted > 0) {
            res.status(200).json({ message: "The resource has been deleted."});
        } else {
            res.status(404).json({ error: "The resource could not be found."})
        }
    } catch(err) {
        res.status(500).json({ message: "A network error occurred"})
    }
})

// GET all posts in a training series by training series ID
router.get("/:id/posts", async (req, res) => {
    try {
        const { id } = req.params;

        //get training series by id
        const trainingSeries = await TrainingSeries.findById(id);

        //get all posts of training series
        const posts = await TrainingSeries.getTrainingSeriesPosts(id);

        res.status(200).json({ trainingSeries, posts })
    } catch(err) {
        res.status(500).json({ message: "A network error occurred" })
    }
})
module.exports = router;