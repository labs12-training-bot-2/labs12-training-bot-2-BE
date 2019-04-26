const { createFakeMessages } = require("../Helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("messages").then(function() {
    return knex("messages").insert(createFakeMessages());
  });
};
