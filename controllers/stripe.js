//Dependencies
const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
//const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);

const Users = require("../models/db/users");

/**
 * Overview:
 *The way Stripe works is that you need to have your own stripe account and create a single
 * product. That product will contain 2 different payment plans. "Premium" at $5/month and "Pro"
 *  at $10/month. Those plan then will have corresponding subscriptions. All of this needs to be
 * managed on the stripe.com dashboard.
 */

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
 * Future developers will need to replace the plan Id's
 * with Ids given to them on their stripe dashboard when they create their own
 * strip accounts with a product and different price plans.
 * @param {Integer} id
 * @param {String} plan
 * @return {Object} the updated user account type id.
 */
async function updateUserAccountType(id, plan) {
  let accountTypeID;
  if (plan === "plan_Ex95NK1FuaNiWb") {
    // production = "plan_Ex95NK1FuaNiWb"
    // test ="plan_EyjXqiSYXoKEXf"
    // PREMIUM PLAN
    accountTypeID = 2;
  } else if (plan === "plan_Ex955Zz8JE0ZuW") {
    // production = "plan_Ex955Zz8JE0ZuW"
    // test = "plan_EyjXEzjQkZf78d"
    // PRO PLAN
    accountTypeID = 3;
  } else {
    accountTypeID = 1; //the free plan.
  }
  await Users.update({ "users.id": id }, { account_type_id: accountTypeID });
}

router.post("/", async (req, res) => {
  /**
   * this post allows the stripe plans to be updated, defaults to a free plan and allows upgrades from premium to pro and vice-versa
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
  
   */
  const { token, name, email, user_id, stripe, plan } = req.body;
  if (stripe) {
    try {
      //get the customer from stripe via their stripe id.
      let customer = await getStripeUser(stripe);
      //if their subscription is the free tier let them update to a paid subscription
      if (customer.subscriptions.total_count === 0) {
        let subscription = await subscribe(stripe, plan);
        updateUserAccountType(user_id, plan);
        //return the updated subscription status to the client
        res.status(200).json(subscription);
      } else {
        //if they have a paid subscription, let them update their account to a different plan by unsubscribing and then resubscibing to the new plan.
        await unsubscribe(user_id, stripe);
        let subscription = await subscribe(stripe, plan);
        updateUserAccountType(user_id, plan);
        //return the updated subscription status to the client
        res.status(200).json(subscription);
      }
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  } else {
    //if Stripe id is not found (is null) allow customer to register with stripe
    try {
      //create a customer based on the userId, name, email, and token from stripe.
      let customer = await register(userID, name, email, token);
      //let stripe identitify the customer by the new stripe id.
      let stripe = customer.id;
      //update the user's info with their new stripe id and plan, which is defaulted to free
      await subscribe(stripe, plan);
      updateUserAccountType(userID, plan);
      //return the updated user info to the client
      res.send(customer);
    } catch (err) {
      res.status(500).end();
    }
  }
});
router.post("/register", async (req, res) => {
  /**
   * this endpoint runs the code to have the user register with Stripe
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructured the stripe token, user name, email, id, and their plan off the request parameters
  const { token, name, email, user_id, plan } = req.body;

  try {
    //register the customer with their id, name, email, and token from stripe.
    let customer = await register(user_id, name, email, token);
    //creates the stripe id for that customer aka the user.
    let stripe = customer.id;
    //sets up the subscription on stripe to the defaulted free plan
    await subscribe(stripe, plan);
    //get's the customers info with their new stripe id.
    customer = await getStripeUser(customer.id);
    //updates the account accordingly
    updateUserAccountType(user_id, plan);
    //returns the new customer.
    res.send(customer);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
});

router.post("/unsubscribe", async (req, res) => {
  /**
   * allows user to unsubscribe from their current plan.
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  // Destructured user id and their stripe id off the request parameters
  const { user_id, stripe } = req.body;
  if (stripe) {
    try {
      //unsubscribes the user
      let res = unsubscribe(user_id, stripe);
      //updates their account about the unsubscription
      updateUserAccountType(user_id);
      //they are now successfully unsubscribed
      res.status(200);
    } catch (err) {
      res.send(err);
    }
  }
});

router.get("/plans", async (req, res) => {
  /**
   * get the different plans we offer.
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */

  //if we add more plans the 3 needs to be changed. comment and uncomment out the product line depending on if
  //you plan on taking real cards with the live code or are using fake numbers for testing.
  //remember to put the your codes from your own stripe account in.
  try {
    stripe.plans.list(
      {
        limit: 3,
        //remember to swap between these too id's depending if you want to show test or production product
        //and it's corresponding plans/subscriptions.
        product: "prod_Ex92rwszM77RQA"
        // product: 'prod_Ex92rwszM77RQA'
        // test: "prod_EyjWGnhGwmQIsE"
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
  /**
   * get the different subscription plans
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */
  try {
    //only retrieve 3 subscriptions that go with the 3 plans we offer, if more plans are added this limit number should change.
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
  /**
   * gets and shows the customer's current plan according to stripe.
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */
  try {
    await stripe.customers.retrieve(req.body.stripe, function(err, customer) {
      res.send(customer);
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/paymentintent", async (req, res) => {
  /**
   * This route is required by Stipe in their documentation to allow you to collect payment.
   * https://stripe.com/docs/payments/payment-intents
   *
   * @function
   * @param {Object} req - The Express request object
   * @param {Object} res - The Express response object
   * @returns {Object} - The Express response object
   */
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
