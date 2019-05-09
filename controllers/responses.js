//Dependencies
const router = require("express").Router();

//Models
const Responses = require("../models/db/responses");

//data validation
const { responseSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

router.route("/").post(validation(responseSchema), async (req, res) => {
  const newResponse = await Responses.add(req.body);
  return res.status(201).json({ newResponse });
});
//do i need to add any 400 error handling or requirements?

router
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const response = await Responses.find({ "r.id": id }).first();

    if (!response) {
      return res.status(404).json({
        message: "sorry, we couldn't find that one."
      });
    }
    return res.status(200).json({ response });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const deleted = await Responses.remove(id);
    return deleted > 0
      ? res.status(200).json({ message: "The resource has been deleted." })
      : res.status(404).json({ message: "The resource could not be found." });
  });

module.exports = router;
