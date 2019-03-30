//Dependencies
const router = require('express').Router();
const stripe = require('stripe')('sk_test_I3A5cCkzbD6C7HqqHSt7uRHH00ht9noOJw');

const Users = require('../database/Helpers/user-model.js');

async function subscribe(stripeID, userID, plan) {
	try {
		// let subID;
		let subID = await stripe.customers.retrieve(stripeID);
		console.log('subID', subID);

		if (subID.subscriptions.total_count === 0) {
			let sub = await stripe.subscriptions.create(
				{ customer: stripeID, items: [{ plan: plan }] },
				function(err, subscription) {
					console.log('subscription', subscription);
					return subscription;
				}
			);
			console.log('sub', sub);
		} else {
			subID = subID.subscriptions.data[0].id;
			let cancelled = await stripe.subscriptions.del(subID);
			let sub = await stripe.subscriptions.create({
				customer: stripeID,
				items: [
					{
						plan: plan,
					},
				],
			});
			if (sub) {
				let id;
				if (plan === 'plan_EmJaXZor4Ef3co') {
					id = 3;
				} else if (plan === 'plan_EmJallrSdkqpPS') {
					id = 2;
				}
				let changes = { accountTypeID: id };
				Users.updateUser(userID, changes);
				return id;
			}
		}
	} catch (error) {
		console.log('error', error);
	}
}
const unsubscribe = async (stripeID, userID) => {
	try {
		return await stripe.customers.retrieve(stripeID, async function(err, customer) {
			// asynchronously called
			let subID = customer.subscriptions.data[0].id; //Gets the one subscription ID the customer can have

			// API for removing subscription
			let confirmation = await stripe.subscriptions.del(subID);
			// need to add back in the update to accountID in database. Would prefer it to be handled by the actions though
			console.log('confirmation', confirmation);
			return 1;
		});
	} catch (error) {
		console.log(error);
	}
};
async function registerSubscribe(name, email, token, userID, plan) {
	// not currently updating the store with the new account typeid
	try {
		let customer = await stripe.customers.create({
			description: name,
			email: email,
			source: token, // obtained with Stripe.js
		});

		const changes = { stripe: customer.id };
		Users.updateUser(userID, changes);

		let sub = await stripe.subscriptions.create({
			customer: customer.id,
			items: [
				{
					plan: plan,
				},
			],
		});
		if (sub) {
			let id;
			if (plan === 'plan_EmJaXZor4Ef3co') {
				id = 3;
			} else if (plan === 'plan_EmJallrSdkqpPS') {
				id = 2;
			}
			let changes = { accountTypeID: id };
			Users.updateUser(userID, changes);
			return id;
		}

		return { stripe: customer.id, subscription: sub };
	} catch (error) {
		console.log(error);
	}

	///////====================
	// API for creating a customer in Stripe's system
	// stripe.customers.create(
	// 	{
	// 		description: name,
	// 		email: email,
	// 		source: token, // obtained with Stripe.js
	// 	},
	// 	function(err, customer) {
	// 		// asynchronously called
	// 		// add strip user_id to the database
	// 		const changes = { stripe: customer.id };
	// 		Users.updateUser(userID, changes);

	// 		// calls subscribe function to subsribe the user
	// 		let sub = subscribe(customer.id, userID);
	// 		return sub;
	// 	}
	// );
}

router.post('/', async (req, res) => {
	const { token, name, email, userID, stripe, plan } = req.body;
	if (stripe) {
		try {
			console.log('Subscribe Only');

			// calls subscribe function to subsribe the user
			let sub = await subscribe(stripe, userID, plan);
			res.status(200).json(sub);
		} catch (err) {
			res.status(500).end();
		}
	} else {
		try {
			console.log('Register & Subscribe');

			// calls registerSubscribe function to register and then subsribe the user to the plan
			let sub = registerSubscribe(name, email, token, userID, plan);
			console.log('sub', sub);
			res.status(200).json(sub);
		} catch (err) {
			res.status(500).end();
		}
	}
});

router.post('/unsubscribe', async (req, res) => {
	const { userID, stripe } = req.body;
	console.log('req body', req.body);
	if (stripe) {
		try {
			let res = unsubscribe(stripe, userID);
			let changes = { accountTypeID: 1 };
			Users.updateUser(userID, changes);

			res.send(1);
		} catch (err) {
			res.send(err);
		}
	}
});

router.get('/plans', (req, res) => {
	stripe.plans.list(
		{
			limit: 3,
			product: 'prod_EmJZbRNGEjlOY4',
		},
		function(err, plans) {
			// console.log('plans', plans.data);
			res.send(plans.data);
		}
	);
});
router.get('/subscriptions', (req, res) => {
	stripe.subscriptions.list(
		{
			limit: 3,
		},
		function(err, subscriptions) {
			res.send(subscriptions.data);
		}
	);
});
router.get('/customer/plan', (req, res) => {
	console.log('customer plan', req.body);
	stripe.customers.retrieve(req.body.stripe, function(err, customer) {
		res.send(customer);
	});
});

// Cancel subscription route

router.post('/paymentintent', async (req, res) => {
	const paymentIntent = await stripe.paymentIntents.create({
		amount: 1099,
		currency: 'usd',
		payment_method_types: ['card'],
	});
	res.json({ paymentIntent });
});

module.exports = router;

// {
//     "paymentIntent": {
//         "id": "pi_1EIOHVChlDwQi04I8wjlU0WJ",
//         "object": "payment_intent",
//         "amount": 1099,
//         "amount_capturable": 0,
//         "amount_received": 0,
//         "application": null,
//         "application_fee_amount": null,
//         "canceled_at": null,
//         "cancellation_reason": null,
//         "capture_method": "automatic",
//         "charges": {
//             "object": "list",
//             "data": [],
//             "has_more": false,
//             "total_count": 0,
//             "url": "/v1/charges?payment_intent=pi_1EIOHVChlDwQi04I8wjlU0WJ"
//         },
//         "client_secret": "pi_1EIOHVChlDwQi04I8wjlU0WJ_secret_whxC5w22vn5KAyLK6ANM3z7n9",
//         "confirmation_method": "publishable",
//         "created": 1553641329,
//         "currency": "usd",
//         "customer": null,
//         "description": null,
//         "last_payment_error": null,
//         "livemode": false,
//         "metadata": {},
//         "next_action": null,
//         "on_behalf_of": null,
//         "payment_method_types": [
//             "card"
//         ],
//         "receipt_email": null,
//         "review": null,
//         "shipping": null,
//         "source": null,
//         "statement_descriptor": null,
//         "status": "requires_payment_method",
//         "transfer_data": null,
//         "transfer_group": null
//     }
// }
