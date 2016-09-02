var moment = require('moment');

var jsend = require('../util/jsend');

module.exports = function (router, config, request) {
  router.get('/api/briefings/:id', briefings);

  function forwardRequestCall (url, res, next, parse) {
    console.log('executing forwardRequestCall(' + url + ')');
    request(url, function (error, response, body) {
      if (error) return next(error);
      if (response.statusCode != 200) return next(jsend.error(response.statusCode, error));

      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      data = parse ? parse(body) : body;

      res
        .append('Content-Type', 'application/json')
        .send(jsend.success(data));
    });
  }

  //region briefings
  function briefings (req, res, next) {

    var url = config.muleHost + config.endpoints.briefings + '?cp=' + req.params.id;

    forwardRequestCall(url, res, next);
  }

  //endregion
};
