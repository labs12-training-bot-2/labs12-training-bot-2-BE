//Dependencies
const router = require('express').Router();
const stripe = require('stripe')('sk_test_I3A5cCkzbD6C7HqqHSt7uRHH00ht9noOJw');

// const Users = require('../database/Helpers/user-model.js');

// stripe.charges.retrieve('ch_1EHzLXChlDwQi04Iono5543P', {
// 	api_key: 'sk_test_I3A5cCkzbD6C7HqqHSt7uRHH00ht9noOJw',
// });

router.post('/', async (req, res) => {
	// const { id } = req.body;

	try {
		// const user = await Users.findById(id);
		// if (!user.id)
		let { customer } = await stripe.customers.create(
			{
				description: `Customer for ${email}`,
				source: 'tok_amex', // obtained with Stripe.js
				email: { email },
			},
			function(err, customer) {
				// asynchronously called
				console.log(customer);
			}
		);
		let { status } = await stripe.charges.create({
			amount: 2000,
			currency: 'usd',
			description: 'An example charge',
			source: req.body,
		});

		res.json({ status, customer });
	} catch (err) {
		res.status(500).end();
	}
});

module.exports = router;
