const { createFakeRelationalEntries } = require("../../helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("relational_table").then(function() {
    return knex("relational_table").insert(createFakeRelationalEntries());
  });
};
