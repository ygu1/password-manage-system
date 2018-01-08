import _ from 'underscore';

module.exports.requireLogin = (req, res, next) => {
  if (_.isEmpty(req.session.user)) {
    return res.send(401, {
      status: 401,
      message: 'Unauthorized'
    });
  }
  return next();
};

module.exports.requireLoginWithRedirect = (req, res, next) => {
  if (req.path === '/auth/callback') {
    return next();
  } else if (_.isEmpty(req.session.user)) {
    req.session.returnTo = req.originalUrl;
    return res.redirect('/login');
  }
  req.user = req.session.user;
  return next();
};
