//Dependencies
const router = require("express").Router();
//const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);

const Users = require("../models/db/users");

/**
 * When a user is created their stripe ID is null until they sign up for a
 * plan. Doing that starts this process gives them a stripeID from the Stripe API
 *
 * @function
 * @param {null} stripeID
 * @returns {String} stripeID
 */
async function getStripeUser(stripeID) {
  try {
    return await stripe.customers.retrieve(stripeID);
  } catch (error) {
    console.log(error);
  }
}

/**
 * Now that the user has a valid stripeID, this passes that new ID and the
 * plan they choice to the Stripe API to create a recurring subscription for them.
 * @function
 * @param {String} stripeID
 * @param {String} plan
 * @returns {Object} the new subscription plan for the customer.
 */
async function subscribe(stripeID, plan) {
  try {
    return await stripe.subscriptions.create({
      customer: stripeID,
      items: [{ plan: plan }]
    });
  } catch (error) {
    console.log(error);
  }
}

/**
 * unsubscribes a user from their current subscription plan.
 *
 * @function
 * @param {Integer} userID
 * @param {String} stripeID
 * @param {String} plan
 * @returns the updated user account type plan to being the free plan.
 */
async function unsubscribe(userID, stripeID, plan) {
  try {
    let customer = await getStripeUser(stripeID);
    let subID = customer.subscriptions.data[0].id;
    await stripe.subscriptions.del(subID);
    updateUserAccountType(userID, plan);
  } catch (error) {
    console.log(error);
  }
}

/**
 * registers a user with Stripe.
 * @param {Integer} id
 * @param {String} name
 * @param {String} email
 * @param {String} token this comes from Stripe.JS
 * @return {Object} the newly registered customer.
 */
async function register(id, name, email, token) {
  try {
    let customer = await stripe.customers.create({
      description: name,
      email: email,
      source: token
    });
    await Users.update({ "users.id": id }, { stripe: customer.id });
    return customer;
  } catch (error) {
    console.log(error);
  }
}

/**
 * To update the user account type between free, premium and pro.
 * The commented out code is for testing stripe functionality or for
 * taking live payments. Future developers will need to replace the plan Id's
 * with Ids given to them on their stripe dashboard when they create their own
 * strip accounts with a product and different price plans.
 * @param {Integer} id
 * @param {String} plan
 * @return {Object} the updated user account type id.
 */
async function updateUserAccountType(id, plan) {
  // 	// LIVE
  // 	let accountTypeID;
  // 	if (plan === 'plan_Ex95NK1FuaNiWb') {
  // 		// LIVE - PREMIUM PLAN
  // 		accountTypeID = 2;
  // 	} else if (plan === 'plan_Ex955Zz8JE0ZuW') {
  // 		// LIVE - PRO PLAN
  // 		accountTypeID = 3;
  // 	} else {
  // 		accountTypeID = 1;
  // 	}
  // 	Users.update(id, { account_type_id: accountTypeID });

  // TEST;
  let accountTypeID;
  if (plan === "plan_EyjXqiSYXoKEXf") {
    // TEST - PREMIUM PLAN
    accountTypeID = 2;
  } else if (plan === "plan_EyjXEzjQkZf78d") {
    // TEST - PRO PLAN
    accountTypeID = 3;
  } else {
    accountTypeID = 1;
  }
  await Users.update({ "users.id": id }, { account_type_id: accountTypeID });
}

router.post("/", async (req, res) => {
  const { token, name, email, user_id, stripe, plan } = req.body;
  if (stripe) {
    try {
      let customer = await getStripeUser(stripe);

      if (customer.subscriptions.total_count === 0) {
        let subscription = await subscribe(stripe, plan);
        updateUserAccountType(user_id, plan);
        res.status(200).json(subscription);
      } else {
        await unsubscribe(user_id, stripe);
        let subscription = await subscribe(stripe, plan);
        updateUserAccountType(user_id, plan);

        res.status(200).json(subscription);
      }
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  } else {
    try {
      let customer = await register(userID, name, email, token);
      let stripe = customer.id;
      await subscribe(stripe, plan);
      updateUserAccountType(userID, plan);

      res.send(customer);
    } catch (err) {
      res.status(500).end();
    }
  }
});
router.post("/register", async (req, res) => {
  const { token, name, email, user_id, plan } = req.body;

  try {
    let customer = await register(user_id, name, email, token);
    let stripe = customer.id;
    await subscribe(stripe, plan);
    customer = await getStripeUser(customer.id);
    updateUserAccountType(user_id, plan);

    res.send(customer);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

router.post("/unsubscribe", async (req, res) => {
  const { user_id, stripe } = req.body;
  if (stripe) {
    try {
      let res = unsubscribe(user_id, stripe);
      updateUserAccountType(user_id);

      res.status(404);
    } catch (err) {
      res.send(err);
    }
  }
});

router.get("/plans", async (req, res) => {
  try {
    // // LIVE
    // stripe.plans.list(
    // 	{
    // 		limit: 3,
    // 		product: 'prod_Ex92rwszM77RQA' // LIVE
    // 	},
    // 	function(err, plans) {
    // 		res.send(plans.data);
    // 	}
    // );

    //TEST
    stripe.plans.list(
      {
        limit: 3,
        product: "prod_EyjWGnhGwmQIsE" // TEST
        // product: 'prod_Ex92rwszM77RQA' //Live
      },
      function(err, plans) {
        if (err) {
          return console.error("I made it and caught an error", err);
        }
        return res.status(200).json(plans.data);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
router.get("/subscriptions", async (req, res) => {
  try {
    await stripe.subscriptions.list(
      {
        limit: 3
      },
      function(err, subscriptions) {
        res.send(subscriptions.data);
      }
    );
  } catch (error) {
    console.log(error);
  }
});
router.get("/customer/plan", async (req, res) => {
  try {
    await stripe.customers.retrieve(req.body.stripe, function(err, customer) {
      res.send(customer);
    });
  } catch (error) {
    console.log(error);
  }
});

// Cancel subscription route

router.post("/paymentintent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      payment_method_types: ["card"]
    });
    res.json({ paymentIntent });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
