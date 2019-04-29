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

//todo: complete passport configs
// Callback function called once the sign-in is complete
// AND an access token has been obtained
async function signInComplete(
  // iss,
  // sub,
  // refreshToken,
  // params, //currently not implemented
  profile,
  accessToken,
  done
) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."), null);
  }

  // Save the profile and tokens in user storage
  users[profile.oid] = { profile, accessToken };
  return done(null, users[profile.oid]);
}

// Configure OIDC strategy
passport.use(
  new OIDCStrategy(
    {
      identityMetadata: `${process.env.OAUTH_AUTHORITY}${
        process.env.OAUTH_ID_METADATA
      }`,
      clientID: process.env.OAUTH_APP_ID,
      responseType: "code id_token",
      responseMode: "form_post",
      redirectUrl: process.env.OAUTH_REDIRECT_URI,
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.OAUTH_APP_PASSWORD,
      validateIssuer: false,
      passReqToCallback: false,
      scope: process.env.OAUTH_SCOPES.split(" ")
    },
    signInComplete
  )
);

router.use(passport.initialize());
router.use(passport.session());

router.use(flash());

//todo: finish building endpoints
router.get("/", (req, res) => {
  res.send("Yooooo");
});

router.use((req, res, next) => {
  res.locals.error = req.flash("error_msg");

  let errs = req.flash("error");
  for (let i in errs) {
    res.locals.error.push({ message: "An error occurred", debug: errs[i] });
  }
});

router.get(
  "/signin",
  // (req, res, next) => {
  //   )(req, res, next);
  // },
  async (req, res) => {
    try {
      await passport.authenticate("azuread-openidconnect", {
        response: res,
        prompt: "login",
        failureRedirect: "/",
        failureFlash: true
      });
      res.status(200).json(res.data);
    } catch (error) {
      res.status(500).json(err);
    }
    // res.redirect("/");
  }
);

router.post(
  "/callback",
  (req, res, next) => {
    passport.authenticate("azuread-openidconnect", {
      response: res,
      failureRedirect: "/",
      failureFlash: true
    })(req, res, next);
  },
  (req, res) => {
    // TEMPORARY!
    // Flash the access token for testing purposes
    req.flash("error_msg", {
      message: "Access token",
      debug: req.user.accessToken
    });
    res.redirect("/");
  }
);

module.exports = router;
