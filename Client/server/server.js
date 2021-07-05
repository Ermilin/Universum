require('dotenv').config();
const express = require('express');
const http = require('http');
const next = require('next');
const uid = require('uid-safe');
const expressSession = require('express-session');
const authRoutes = require('./auth-routes');

const dev = process.env.NODE_ENV !== 'production';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const app = next({
  dev,
  dir: '.',
});
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  const session = {
    secret: uid.sync(18),
    cookie: {
      maxAge: 86400 * 1000, // 24 hours in milliseconds
    },
    resave: false,
    saveUninitialized: true,
  };
  server.use(expressSession(session));

  const { getConfiguredPassport } = require('./passport');

  (async () => {
    const passport = await getConfiguredPassport();
    server.use(passport.initialize());
    server.use(passport.session());
    server.use(authRoutes);

    const restrictAccess = (req, res, next) => {
      if (!req.isAuthenticated()) return res.redirect('/login');
      next();
    };

    server.use('/', restrictAccess);

    // hantera allt annat med Next.js
    server.get('*', handle);

    http.createServer(server).listen(process.env.PORT, () => {
      console.log(`listening on port ${process.env.PORT}`);
    });
  })();
});
