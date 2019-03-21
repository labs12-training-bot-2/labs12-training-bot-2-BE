//Dependencies
const router = require('express').Router();

//Models

const Users = require('../database/Helpers/user-model.js');
const TeamMembers = require('../database/Helpers/teamMember-model.js');

//Middleware

//Routes
// GET all users
router.get('/', async (req, res) => {
	try {
		const users = await Users.find();
		res.status(200).json({ users });
	} catch(err) {
		res.status(500).json(err);
	}
});

// GET all members associated with user
router.get('/:id/team-members', async (req, res) => {
	try {
		const userId = req.params.id;
		const members = await TeamMembers.findBy({user_ID: userId});
		res.status(200).json({ members });
	} catch(err) {
		res.status(500).json(err);
	}
})

module.exports = router;
