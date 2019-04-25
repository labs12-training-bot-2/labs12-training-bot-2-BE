exports.seed = function(knex, Promise) {
  return knex("accountType").then(function() {
    return knex("accountType").insert([
      { accountType: "free", maxNotificationCount: 50 },
      { accountType: "premium", maxNotificationCount: 200 },
      { accountType: "pro", maxNotificationCount: 1000 }
    ]);
  });
};
