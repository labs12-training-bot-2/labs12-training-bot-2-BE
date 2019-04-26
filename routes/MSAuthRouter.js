const router = require("express").Router();

const session = require("express-session");
const flash = require("connect-flash");

router.use(
  session({
    secret: process.env.MS_SESSION_SECRET || "Batman's identity is Bruce Wayne",
    resave: false,
    saveUninitialized: false,
    unset: "destroy"
  })
);

const passport = require("passport");
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;

// Configure passport

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
var users = {};

// Passport calls serializeUser and deserializeUser to
// manage users
passport.serializeUser(function(user, done) {
  // Use the OID property of the user as a key
  users[user.profile.oid] = user;
  done(null, user.profile.oid);
});

passport.deserializeUser(function(id, done) {
  done(null, users[id]);
});

module.exports = server;
