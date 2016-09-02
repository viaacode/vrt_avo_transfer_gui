  var readFile = require('../util/read-file');
var path = require('path');
var _ = require('underscore');

function environment (name) {
  var parts = {
    qas: [qas, authentication],
    development: [qas]
  }[name];

  if (!parts) throw new Error('Environment not defined: ' + name);
  return parts;
}

var basedir = path.join(__dirname, '../../');
var muleEndpoint = 'http://do-qas-esb-01.do.viaa.be:10005';

// not used but example of all available properties
var template = {
  // host of mule
  muleHost: null,
  // Map path to mule endpoints
  endpoints: null,
  // used to map SAML data to available services
  services: null,
  // general app settings
  app: null,
  // contains functions used to get the path to a file or folder
  paths: null,
  // toggle to show api links on /api/docs
  showApiDocs: false,
  // replace all outgoing calls to Mule by dummy data
  dummyRequest: false,
  // fake that these services are available when not logged in
  fakeServicesAvailable: null,
  // api delay for testing graph loading
  apiDelay: null,
  // show extended error messages in api call responses
  showErrors: false,
  // log errors in server console
  logErrors: false,
  // settings for authentication
  passport: null
};

var qas = {
  // Mule endpoint
  muleHost: 'http://do-qas-esb-01.do.viaa.be:10005',
  // toggle to show api links on /api/docs
  showApiDocs: true,
  // general app settings
  app: {
    // used in console to tell which app is started
    name: 'VRT_AVO_TRANSFER',
    port: process.env.PORT || 80,
    sessionSecret: process.env.SESSION_SECRET || 'VRT_AVO_TRANSFER'
  },
  paths: {
    server: pathFromServer,
    app: pathFromApp
  },
  services: {
    map: {
      'mediahaven': 'MAM',
      'amsweb': 'AMS',
      'FTP': 'FTP',
      'skryvweb': 'DBS'
    }
  },
  // show extended error messages in api calls
  showErrors: true
};

var authentication = {
  // disable api delay for testing graph loading
  apiDelay: null,
  // settings for authentication
  passport: {
    strategy: 'saml',
    saml: {
      // URL that goes from the Identity Provider -> Service Provider
      callbackUrl: process.env.SAML_PATH || 'mijn-qas.viaa.be/login/callback',

      // URL that goes from the Service Provider -> Identity Provider
      entryPoint: process.env.SAML_ENTRY_POINT || 'https://idp-qas.viaa.be/saml2/idp/SSOService.php',

      // Url to logout from the Identity Provider
      logoutUrl: 'https://idp-qas.viaa.be/saml2/idp/SingleLogoutService.php',

      // Usually specified as `/shibboleth` from site root
      issuer: process.env.ISSUER || 'passport-saml',

      identifierFormat: null,

      // Service Provider private key
      // decryptionPvk: readFile(pathFromServer('/cert/key.pem')),

      // Service Provider Certificate
      // privateCert: readFile(pathFromServer('/cert/cert.pem')),

      // Identity Provider's public key
      cert: process.env.SAML_CERT || readFile(pathFromServer('/cert/idp_cert.pem')),

      validateInResponseTo: false,
      disableRequestedAuthnContext: true
    }
  }
};

//region functions for path resolution
function pathFromServer (p) {
  return path.join(basedir, 'server/', p || '.');
}

function pathFromApp (p) {
  return path.join(basedir, 'app/', p || '.');
}
//endregion

/**
 * builds up config from 'environments' field,
 */
module.exports = function (environmentName) {
  var environmentParts = environment(environmentName);
  if (!environmentParts) {
    console.log("Error: environment: '" + environmentName + "' is unknown");
    process.exit(1);
  }

  var config = {};

  // merge different environments
  /* Warning: _.extend() will only copy one deep - eg.
   * {foo: {a:1, b:2}, bar: 'x'}
   * +
   * {foo: {c:3}}
   * =
   * {foo: {c:3}, bar: 'x'}
   * !=
   * {foo: {a:1, b:2, c:3}, bar: 'x'}
   * */
  _.each(environmentParts, function (env) {
    _.extend(config, env);
  });

  return config;
};