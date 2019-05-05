const { createFakeNotifications } = require(".../../helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("notifications").then(function() {
    return knex("notifications").insert(createFakeNotifications());
  });
};
