const db = require("../dbConfig.js");

module.exports = {
  add,
  find,
  findBy,
  findById,
  update
};

function find() {
  return db("TeamMember");
}

function findBy(filter) {
  return db("TeamMember").where(filter);
}

async function add(member) {
  const [id] = await db("TeamMember").insert(member);

  return findById(id);
}

function findById(id) {
  return db("TeamMember")
    .where({teamMemberID: id})
    .first();
}

async function update(id, member) {
  await db("TeamMember").where({teamMemberId: id}).update(member);

  return await findById(id)
}
