exports.seed = function(knex, Promise) {
  return knex("account_types").then(function() {
    return knex("account_types").insert([
      { account_type: "free", max_notification_count: 50 },
      { account_type: "premium", max_notification_count: 200 },
      { account_type: "pro", max_notification_count: 1000 }
    ]);
  });
};
