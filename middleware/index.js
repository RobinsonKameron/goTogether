module.exports = function (express, cookieParser, app, tripsRouter, mongoose, ConnectMongo, passport, port, env, session, config) {
  const moment = require('moment');
  const forceSsl = function (req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
  };

  app.use(require('body-parser').urlencoded({extended: true}));
  app.use(require('body-parser').json());
  app.use(require('morgan')('combined'));
  app.set('json spaces', 3);

  if (env === 'development') {
    // dev specific settings
    app.use(session({secret: config.sessionSecret, saveUninitialized: true, resave: true}));
  } else {
    // production specific settings
    app.use(forceSsl);
    app.use(session({
      secret: config.sessionSecret,
      store: new ConnectMongo({url: config.dburl, mongooseConnection: mongoose.connection, stringify: true})
    }));
  } // endelse

  app.use(passport.initialize());
  app.use(passport.session());

  app.use((req, res, next) => {
    if (req.user) {
      console.log(`
        SHOWING FROM Middleware
        ${JSON.stringify(req.user.id, null, 10)}
        `);
      next();
    } else {
      next();
    }
  });

  app.use((req, res, next) => {
    if (req.query.checkIn || req.query.checkOut) {
      req.query.checkIn = moment(req.query.checkIn).format('YYYY-MM-DD');
      req.query.checkOut = moment(req.query.checkOut).format('YYYY-MM-DD');
      next();
    } else {
      next();
    }
  });

  /* secure all routes with auth
  let lockedRoutes = (req, res, next) => {
    let { apiTestingKey } = req.body;
    if (req.isAuthenticated() || process.env.NODE_APITESTINGKEY === apiTestingKey) {
      next();
    } else {
      res.redirect('/');
    }
  };

  app.all('/api/*', lockedRoutes, (req, res, next) => {
    next(); // pass control to the next handler
  });
  */
  app.set('port', process.env.PORT || port);
};
