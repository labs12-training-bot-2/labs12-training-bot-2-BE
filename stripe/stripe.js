var stripe = require('stripe')('sk_test_I3A5cCkzbD6C7HqqHSt7uRHH00ht9noOJw');
var elements = stripe.elements();

stripe.charges.retrieve('ch_1EHzLXChlDwQi04Iono5543P', {
	api_key: 'sk_test_I3A5cCkzbD6C7HqqHSt7uRHH00ht9noOJw',
});
