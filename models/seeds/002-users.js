const { createFakeUsers } = require("../Helpers/fakeData");

exports.seed = function(knex, Promise) {
  return knex("users").then(function() {
    return knex("users").insert(createFakeUsers());
  });
};
