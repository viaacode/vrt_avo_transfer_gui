var _ = require('underscore');

module.exports = function (config) {
  return function (req, res, next) {
    var min = config.apiDelay.min || 1; //seconds
    var max = config.apiDelay.max || 3; //seconds
    var duration = Math.floor(Math.random() * (max - min) + min);
    duration *= 1000;

    _.delay(next, duration);
  };
};
