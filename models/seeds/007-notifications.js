const { createFakeNotifications } = require("../Helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("notifications").then(function() {
    return knex("notifications").insert(createFakeNotifications());
  });
};
