const { createFakeTeamMembers } = require("./fakeData");
exports.seed = function(knex, Promise) {
  return knex("TeamMember").then(function() {
    return knex("TeamMember").insert(createFakeTeamMembers());
  });
};
