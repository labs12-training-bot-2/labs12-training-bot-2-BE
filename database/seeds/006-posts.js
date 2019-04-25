const { createFakePosts } = require("../Helpers/fakeData");
exports.seed = function(knex, Promise) {
  return knex("Post").then(function() {
    return knex("Post").insert(createFakePosts());
  });
};
