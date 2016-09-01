var _ = require('underscore');

module.exports = function (app, config) {
  app.get('/public/js/saml-properties-for-frontend.js', getAvailableServices);

  function getAvailableServices (req, res, next) {
    var services;
    var organisationName;
    if (req.user) {
      services = parseServices(req.user.apps) || {};
      organisationName = req.user.oNickname || '';
    } else {
      services = config.fakeServicesAvailable || {};
      organisationName = '';
    }

    var mijnVIAA = 'var mijnVIAA=mijnVIAA||{};mijnVIAA.isServiceAvailable=function(serviceName){return ' +
      JSON.stringify(services) +
      '[serviceName];};mijnVIAA.getOrganisationName=function(){return "' +
      organisationName +
      '";};';

    res.send(mijnVIAA);
  }

  function parseServices (input) {
    var services = {};

    for (var key in input) {
      var value = input[key];
      var mapped = config.services.map[value];

      if (!mapped) {
        console.log("WARNING: saml-properties-for-frontend.js service '" + value + "' is unknown, skipping");
        continue;
      }

      services[mapped] = 1;
    }

    _.extend(services, config.services.always);

    return services;
  }
};
