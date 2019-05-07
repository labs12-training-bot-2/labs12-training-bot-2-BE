exports.seed = function(knex, Promise) {
  return knex("account_types").then(function() {
    return knex("account_types").insert([
      { title: "free", max_notification_count: 50 },
      { title: "premium", max_notification_count: 200 },
      { title: "pro", max_notification_count: 1000 }
    ]);
  });
};
