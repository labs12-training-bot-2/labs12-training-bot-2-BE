const { createFakeUsers } = require("../Helpers/fakeData");

exports.seed = function(knex, Promise) {
  return knex("User").then(function() {
    return knex("User").insert(createFakeUsers());
  });
};
