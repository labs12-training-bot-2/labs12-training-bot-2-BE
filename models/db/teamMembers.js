const db = require("../index");

module.exports = {
  add,
  find,
  update,
  remove,
  addToNotificationsTable
};

function find(filters) {
  if (filters) {
    return db("team_members AS tm")
    .select(
      'tm.id',
      'tm.first_name',
      'tm.last_name',
      'tm.job_description',
      'tm.email',
      'tm.phone_number',
      'tm.text_on',
      'tm.email_on',
      'tm.slack_on',
      'tm.slack_id',
      'tm.manager',
      'man.first_name AS manager_name',
      'tm.mentor',
      'men.first_name AS mentor_name'
    )
    .join('users AS u', { 'tm.user_id': 'u.id' })
    .leftOuterJoin('team_members AS man', {'tm.manager': 'man.id' })
    .leftOuterJoin('team_members AS men', { 'tm.mentor': 'men.id' })
    .where(filters)
  }
  return db("team_members AS tm")
    .select(
      'tm.id',
      'tm.first_name',
      'tm.last_name',
      'tm.job_description',
      'tm.email',
      'tm.phone_number',
      'tm.text_on',
      'tm.email_on',
      'tm.slack_on',
      'tm.slack_id',
      'tm.manager',
      'man.first_name AS manager_name',
      'tm.mentor',
      'men.first_name AS mentor_name'
    )
    .join('users AS u', { 'tm.user_id': 'u.id' })
    .leftOuterJoin('team_members AS man', {'tm.manager': 'man.id' })
    .leftOuterJoin('team_members AS men', { 'tm.mentor': 'men.id' })
    .leftOuterJoin
}

function add(member) {
  return db("team_members")
    .insert(member, ['*'])
    .then(tm => find({'tm.id': tm[0].id}).first());
}

async function update(id, member) {
  return db("team_members")
    .where({
      id
    })
    .update(member);
}

function remove(id) {
  return db("team_members")
    .where({
      id
    })
    .del();
}

function addToNotificationsTable(data) {
  return db("notifications").insert(data);
}
