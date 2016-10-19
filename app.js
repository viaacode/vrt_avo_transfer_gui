const yaml = require('js-yaml');
const request = require('request');
const fs = require('fs');

try {
    const config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
    const indentedJson = JSON.stringify(config, null, 4);
    //console.log(indentedJson);
} catch (e) {
    console.log(e);
}

var env = process.env.NODE_ENV;

if (config.dummyRequest) {
  request = require('./dummy/dummy')(config).request;
}

var app = require('./server/app.js')(config, request);

// Start server
app.listen(config.app.port, function () {
  console.log('--' + config.app.name + ' API available on port ' + config.app.port);
  console.log('-- Environment: ' + env);
});
