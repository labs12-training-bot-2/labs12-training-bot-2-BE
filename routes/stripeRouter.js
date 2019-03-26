//Dependencies
const router = require('express').Router();
const stripe = require('stripe')('sk_test_I3A5cCkzbD6C7HqqHSt7uRHH00ht9noOJw');

// stripe.charges.retrieve('ch_1EHzLXChlDwQi04Iono5543P', {
// 	api_key: 'sk_test_I3A5cCkzbD6C7HqqHSt7uRHH00ht9noOJw',
// });

router.post('/', async (req, res) => {
	try {
		let { status } = await stripe.charges.create({
			amount: 2000,
			currency: 'usd',
			description: 'An example charge',
			source: req.body,
		});

		res.json({ status });
	} catch (err) {
		res.status(500).end();
	}
});

module.exports = router;
