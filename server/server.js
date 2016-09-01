var configEnvironments = require('./config/config');

var request = require('request');

var env = process.env.NODE_ENV || 'qas';
var config = configEnvironments(env);

if (config.dummyRequest) {
  request = require('./dummy/dummy')(config).request;
}

var app = require('./app')(config, request);

// Start server
app.listen(config.app.port, function () {
  console.log('--' + config.app.name + ' API available on port ' + config.app.port);
});
