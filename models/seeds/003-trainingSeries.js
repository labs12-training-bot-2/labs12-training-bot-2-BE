const { createFakeTrainingSeries } = require("../db/fakeData");
exports.seed = function(knex, Promise) {
  return knex("training_series").then(function() {
    return knex("training_series").insert(createFakeTrainingSeries());
  });
};
