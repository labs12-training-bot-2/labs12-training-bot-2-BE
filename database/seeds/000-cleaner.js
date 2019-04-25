exports.seed = function(knex, Promise) {
  return knex.schema.raw(
    'TRUNCATE "accountType", "User", "TrainingSeries", "TeamMember", "RelationalTable", "Post" RESTART IDENTITY;'
  );
};
