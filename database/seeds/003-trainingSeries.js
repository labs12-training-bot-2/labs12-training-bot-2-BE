const { createFakeTrainingSeries } = require("./fakeData");
exports.seed = function(knex, Promise) {
  return knex("TrainingSeries").then(function() {
    return knex("TrainingSeries").insert(createFakeTrainingSeries());
  });
};
