const { createFakeTrainingSeries } = require("../../helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("training_series").then(function() {
    return knex("training_series").insert(createFakeTrainingSeries());
  });
};
