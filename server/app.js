var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var favicon = require('serve-favicon');

var allowCorsMiddleware = require('./middleware/cors');
var authMiddleware = require('./middleware/authentication');
var delayMiddleware = require('./middleware/delay');

module.exports = function (config, request) {

  //region Initialize server
  var app = express();
  app.set('port', config.app.port);
  app.set('views', config.paths.app('views'));
  app.set('view engine', 'ejs');
  app.use(allowCorsMiddleware);
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.app.sessionSecret
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(favicon(config.paths.app('assets/favicon.png')));
  //endregion


  //region Routes
  // - api documentation
  if (config.showApiDocs) {
    require('./routes/documentation')(app, config);
  }
  // - api
  var apiRouter = express.Router();
  if (config.passport) {
    console.log('Authentication is ON');
    require('./routes/authentication')(app, config, passport);
    apiRouter.use('/api', authMiddleware.errorCode); // (error 401 when not authenticated)
  }
  // delay api for
  config.apiDelay && apiRouter.use('/api', delayMiddleware(config));
  require('./routes/api')(apiRouter, config, request);
  app.use('/', apiRouter);
  // Front-end
  // - user info
  require('./routes/saml-properties-for-frontend')(app, config);
  // - front-end templates (redirect to login when not authenticated)
  require('./routes/front-end')(app, config, config.passport ? authMiddleware.redirect : authMiddleware.ignore);
  // - static files in the public folder
  app.use('/public', express.static(config.paths.app('public')));
  //endregion


  //region Error handling
  // - Log errors && next
  config.logErrors && app.use(logErrors);
  // - Send errors in jsend format || next
  app.use(sendJsendErrors);
  // -Send errors as '500 Internal'
  app.use(sendInternalError);
  //endregion


  return app;


  //region Helper Functions: error handling
  function logErrors (err, req, res, next) {
    console.error(err);
    next(err);
  }

  function sendJsendErrors (err, req, res, next) {
    // if error is in jsend format: send error and do not fall through
    if (err.jsend) {
      return res
        .status(err.status)
        .json(err.jsend);
    }
    //
    next(err);
  }

  function sendInternalError (err, req, res, next) {
    var jsendMessage = {
      status: "error",
      message: "internal",
      code: 500
    };

    //Only print stacktrace when in a dev environment
    if (config.showErrors) {
      jsendMessage.stackTrace = err;
    }

    res.status(500).send(jsendMessage);
  }

  //endregion
};
