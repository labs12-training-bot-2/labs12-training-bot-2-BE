//Dependencies
const router = require("express").Router();
const moment = require("moment");

//Models
const TeamMember = require("../models/db/teamMembers");

// Data validation
const { teamMemberSchema } = require("../models/schemas");
const validation = require("../middleware/dataValidation");

// GET all team members in system (not a production endpoint)
router.route('/')
  .get(async (req, res) => {
    const { user } = res.locals
    console.log(user);
    const teamMembers = await TeamMember.find({
      'u.id': user.id
    });
    res.status(200).json({ teamMembers });
  })
  .post(validation(teamMemberSchema), async (req, res) => {
    const newTeamMember = await TeamMember.add(req.body);
    return res.status(201).json({ newTeamMember });
  });

router.route('/:id')
  .get(async (req, res) => {
      const { id } = req.params;

      // get team member info by id
      const teamMember = await TeamMember.find({ 'tm.id': id });

      // get team member's training series assignments
      //const assignments = await TeamMember.getTrainingSeriesAssignments(id);

      if (!teamMember) {
        return res.status(404).json({ 
          message: "Sorry, but we couldnt find that team member!" 
        });
      }
      
      return res.status(200).json({ teamMember});  //assignments
  })
  .put(validation(teamMemberSchema), async (req, res) => {
    const { id } = req.params;

    const updatedTeamMember = await TeamMember.update(id, req.body);
    return res.status(200).json({ updatedTeamMember });
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    const deleted = await TeamMember.remove(id);
    
    return deleted > 0 
      ? res.status(200).json({ message: "The resource has been deleted." })
      : res.status(404).json({ message: "The resource could not be found." })
  })
module.exports = router;
