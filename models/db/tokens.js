const db = require("../index.js");

module.exports = {
  addToken,
  getToken,
  deleteToken
};

function addToken({ id, service, authToken, refreshToken, expiration }) {
  return db("users")
    .update(
      {
        [`${service}_auth_token`]: authToken,
        [`${service}_refresh_token`]: refreshToken,
        [`${service}_token_expiration`]: expiration
      },
      ["*"]
    )
    .where({ id });
}

function getToken(id, service) {
  return db("users")
    .select(
      `${service}_auth_token`,
      `${service}_refresh_token`,
      `${service}_token_expiration`
    )
    .where({ id })
    .first();
}

function deleteToken(id, service) {
  return db("users")
    .update(
      {
        [`${service}_auth_token`]: null,
        [`${service}_refresh_token`]: null,
        [`${service}_token_expiration`]: null
      },
      ["*"]
    )
    .where({ id });
}
