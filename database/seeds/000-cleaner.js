exports.seed = function(knex, Promise) {
  return knex.schema.raw(
    "TRUNCATE Post, RelationalTable, TeamMember, TrainingSeries, User, accountType RESTART IDENTITY;"
  );
};
