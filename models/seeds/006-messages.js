const { createFakeMessages } = require("../db/fakeData");
exports.seed = function(knex, Promise) {
  return knex("messages").then(function() {
    return knex("messages").insert(createFakeMessages());
  });
};
