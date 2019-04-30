const router = require('express').Router();
const axios = require('axios');

const Users = require('../database/Helpers/user-model.js');

const token = process.env.SLACK_TOKEN;
const api = 'https://slack.com/api';

router.get('/', async (req, res) => {
	try {
		const userlist = await getAllUsers();
		res.status(200).json(userlist);
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'Internal server error fetching Slack users' });
	}
});

module.exports = router;

async function getAllUsers() {
	const endpoint = '/users.list';
	const url = `${api}${endpoint}?token=${token}`;

	const list = await axios.get(url);
	console.log(list.data.members);
	return list.data.members.map(({ id, name, profile: { real_name, display_name, first_name, last_name } }) => ({
		id,
		real_name,
		username: name,
		first_name,
		last_name,
		display_name
	}));
}
