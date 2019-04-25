const { createFakeRelationalEntries } = require("../Helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("RelationalTable").then(function() {
    return knex("RelationalTable").insert(createFakeRelationalEntries());
  });
};
