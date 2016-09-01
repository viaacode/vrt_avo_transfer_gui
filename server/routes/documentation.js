var path = require("path");
var ejs = require("ejs");

var flattenObject = require('../util/flatten-object');

module.exports = function (app, config) {

  var findRoutes = flattenObject(function (key, value) {
    return {
      localPath: {
        title: value,
        url: value,
        extra: ''
      },
      toEndpoint: {
        title: config.muleHost + value,
        url: config.muleHost + value,
        extra: config.dummyRequest ? '(mocked with dummy data)' : ''
      }
    };
  });

  var routes = findRoutes('/api', config.endpoints, []);

  function showDocumentation (req, res, next) {
    res.render('documentation', {
      routes: routes
    });
  }

  app.get('/api/', showDocumentation);
};
