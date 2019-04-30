exports.seed = function(knex, Promise) {
  return knex.schema.raw(
    "TRUNCATE account_types, users, training_series, team_members, relational_table, messages, notifications RESTART IDENTITY;"
  );
};
