var saml = require('passport-saml');
var fs = require('fs');

module.exports = function (app, config, passport) {
  var samlStrategy = new saml.Strategy(config.passport.saml, function (profile, done) {
    return done(null, profile);
  });
  
  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
  
  passport.use(samlStrategy);

  app.get('/login',
    passport.authenticate('saml', {failureRedirect: '/login/fail'}),
    function (req, res) {
      res.redirect(303, '/');
    }
  );

  app.post('/login/callback',
    passport.authenticate('saml', {failureRedirect: '/login/fail'}),
    function (req, res, next) {
      res.redirect(303, '/');
    }
  );

  app.get('/login/fail',
    function (req, res) {
      res.status(401).send('Login failed');
    }
  );

  app.get('/logout', function (req, res) {
    // we only have the nameID
    req.user.nameIDFormat = '';


    samlStrategy.logout(req, function(err, request){
      if(!err){
        //redirect to the IdP Logout URL
        res.redirect(request);
      }
    });
  });

  app.get('/logout/callback', function (req, res) {
    req.logout();
    res.redirect('/');
  });

  // app.get('/Metadata',
  //   function (req, res) {
  //     res.type('application/xml');
  //     res.status(200).send(samlStrategy.generateServiceProviderMetadata(fs.readFileSync(config.paths.server('cert/cert.pem'), 'utf8')));
  //   }
  // );
};
