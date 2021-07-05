const express = require('express');
const router = express.Router();
const passport = require('passport');
const { Strategy, discoverAndCreateClient } = require('passport-curity');

const getConfiguredPassport = async () => {
  const { ISSUER_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

  const client = await discoverAndCreateClient({
    issuerUrl: ISSUER_URL,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUris: [`${REDIRECT_URI}`],
  });

  const strategy = new Strategy(
    {
      client,
      params: {
        scope: 'openid profile',
      },
    },
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, { profile });
    }
  );

  passport.use(strategy);
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  return passport;
};

exports = module.exports;
exports.getConfiguredPassport = getConfiguredPassport;
exports.passportController = router;
