const { createFakeTeamMembers } = require("../db/fakeData");
exports.seed = function(knex, Promise) {
  return knex("team_members").then(function() {
    return knex("team_members").insert(createFakeTeamMembers());
  });
};
