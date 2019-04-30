// We inherited a poor file structure so we're following it for now.
// Sections I intend to eventually abstract out, I will write with /* */ comments

// This file handles all the Slack API endpoints
const router = require('express').Router();
const axios = require('axios');

const Users = require('../database/Helpers/user-model.js');

const token = process.env.SLACK_TOKEN;
const api = 'https://slack.com/api';

router.get('/', async (req, res) => {
	// Test route, not needed longterm
	try {
		const userlist = await getAllUsers();
		res.status(200).json(userlist);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Internal server error fetching Slack users' });
	}
});

//
router.post('/add', async ({ body: { user_id, slack_id, username } }, res) => {
	// App sends Slack ID or username & user_id in req.body
	// Compare id or username to users in Slack workspace.
	// If approved, save ID in database under the team_members table - slack_id
	// Respond 200
	// If invalid, respond with 400
});

module.exports = router;

async function getAllUsers() {
	const endpoint = '/users.list';
	const url = `${api}${endpoint}?token=${token}`;

	const list = await axios.get(url);
	return list.data.members.map(({ id, name, profile: { real_name, display_name } }) => ({
		id,
		real_name,
		username: name,
		display_name
	}));
}

// MIDDLEWARE
