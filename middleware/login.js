import settings from '../settings';

const GoogleStrategy = require('passport-google-oauth20').Strategy;

module.exports = (passport) => {
  passport.serializeUser((user, done) => {
    if (typeof user === 'string') {
      done(null, JSON.parse(user).shortEmail);
    } else {
      done(null, user.shortEmail);
    }
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  passport.use('googleoauth', new GoogleStrategy({
    clientID: settings.googleOauth.clientID,
    clientSecret: settings.googleOauth.clientSecret,
    callbackURL: settings.googleOauth.callbackURL
  }, (accessToken, refreshToken, profile, cb) => {
    process.nextTick(() => {
      return cb(null, profile);
    });
  }));
};
