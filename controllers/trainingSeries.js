//Dependencies
const router = require("express").Router();

//Models
const TrainingSeries = require("../models/db/trainingSeries");

//Routes

// GET all training series (not a production endpoint)
router.get("/", async (req, res) => {
  //--- complete per trello spec ---
  try {
    const trainingSeries = await TrainingSeries.find();
    res.status(200).json({ trainingSeries });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// GET all messages (not a production endpoint)
router.get("/messages", async (req, res) => {
  try {
    const messages = await TrainingSeries.getAllMessages();
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// GET training series by ID
router.get("/:id", async (req, res) => {
  //--- complete per trello spec ---
  try {
    const { id } = req.params;
    const trainingSeries = await TrainingSeries.findById(id);
    console.log("trainingSeries", trainingSeries);
    trainingSeries.length
      ? res.status(200).json({ trainingSeries })
      : res
          .status(404)
          .json({ message: "sorry, we couldnt find that training series!" });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred: " });
  }
});

router.get("/:id/assignments", async (req, res) => {
  try {
    const { id } = req.params;
    const assignments = await TrainingSeries.getMembersAssigned(id);
    res.status(200).json({ assignments });
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});
// POST a new training series
router.post("/", async (req, res) => {
  //--- complete per trello spec ---
  try {
    const { title, user_id } = req.body;

    if (!title || !user_id) {
      res.status(400).json({
        error: `Client must provide: ${!title ? "-a title" : ""} ${
          !user_id ? "-a user ID" : ""
        }`
      });
    } else {
      const newTrainingSeries = await TrainingSeries.add(req.body);
      res.status(201).json({ newTrainingSeries });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// PUT training series information
router.put("/:id", async (req, res) => {
  //--- complete per trello spec ---
  const { title } = req.body;
  try {
    if (title || title !== "") {
      const { id } = req.params;
      const updatedTrainingSeries = await TrainingSeries.update(id, req.body);
      updatedTrainingSeries.length
        ? res.status(200).json({ updatedTrainingSeries })
        : res.status(404).json({
            message: "sorry, but we couldnt find that training series!"
          });
    } else {
      res.status(400).json({
        message: "Please provide a new title for this training series."
      });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// DELETE a training series
router.delete("/:id", async (req, res) => {
  //--- completed per trello spec ---
  try {
    const { id } = req.params;
    const deleted = await TrainingSeries.remove(id);
    if (deleted > 0) {
      res.status(200).json({ message: "The resource has been deleted." });
    } else {
      res.status(404).json({ error: "The resource could not be found." });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});

// GET all messages in a training series by training series ID
router.get("/:id/messages", async (req, res) => {
  //--- under construction per trello spec ---
  try {
    const { id } = req.params;

    //get training series by id
    const trainingSeries = await TrainingSeries.findById(id);

    //get all messages of training series
    const messages = await TrainingSeries.getTrainingSeriesMessages(id);

    if (!trainingSeries.length) {
      res
        .status(404)
        .json({ message: "Sorry, we couldnt find that training series!" });
    }
    // else if(!messages.length){ //not sure if this is useful or not, will probably handel this on the front end, but i wrote so yea, here ya go :)
    //     res.status(200).json({ trainingSeries, message: "This training series dosnt currently include any messages."});
    // }
    else {
      res.status(200).json({ trainingSeries, messages });
    }
  } catch (err) {
    res.status(500).json({ message: "A network error occurred" });
  }
});
module.exports = router;
