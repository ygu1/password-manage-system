import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import graphqlHTTP from 'express-graphql';
import session from 'express-session';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import passport from 'passport';
import httpProxy from 'http-proxy';
// import favicon from 'serve-favicon';

import settings from './settings';
import bundle from './bundle';

const app = express();
const RedisStore = require('connect-redis')(session);

// if (settings.forceSSL) {
//   app.use((req, res, next) => {
//     if (req.headers['x-forwarded-proto'] !== 'https') {
//       return res.redirect(['https://', req.get('Host'), req.url].join(''));
//     }
//     return next();
//   });
// }
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

app.use(session({
  store: new RedisStore(settings.redisDb),
  secret: settings.secret,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.options('*', cors());

app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

require('./middleware/login')(passport);

const render = (req, res, file, json) => {
  json.siteTtile = 'PMS';
  json.user = req.user;
  return res.render(file, json);
};
const includes = {
  passport,
  render,
  graphqlHTTP
};
require('./routes/server/login')(app, includes);
require('./routes/server/app')(app, includes);
require('./routes/api/index')(app, includes);

if (process.env.NODE_ENV !== 'production') {
  const proxy = httpProxy.createProxyServer();
  bundle();

  app.all('/dist/*', (req, res) => {
    proxy.web(req, res, {
      target: 'http://localhost:3001/'
    });
  });
}

// app.use('/', index);

export default app;
