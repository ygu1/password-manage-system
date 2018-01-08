import loggers from '../../middleware/loggers';

module.exports = (app, includes) => {
  const showLogin = (req, res) => {
    res.redirect('/auth');
  };

  const googleOauth = (req, res, next) => {
    const passportOauth = includes.passport.authenticate('googleoauth', (err, user) => {
      if (err) {
        loggers.get('auth').error(`Unable to login err=${err}`);
      }
      if (user && user.id) {
        if (req.session) {
          req.session.user = user;
          loggers.get('auth').verbose(`Successfully authenticated ${user.id} via google auth.`);
          if (req.session.returnTo) {
            const url = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(url);
          } else {
            res.redirect('/');
          }
        } else {
          res.redirect('/');
        }
      } else {
        res.send('Unable to login to this site');
      }
    });
    return passportOauth(req, res, next);
  };

  app.get('/login', showLogin);
  app.get('/auth', includes.passport.authenticate('googleoauth', { scope: ['email', 'profile'] }));
  app.get('/auth/callback', googleOauth);
};
