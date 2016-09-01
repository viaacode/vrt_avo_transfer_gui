module.exports = function (parse, separator) {
  separator = separator || '/';

  return function findRoutes (key, value, routes) {
    if (typeof value === 'string') {
      routes.push(parse(key, value, routes));
    } else if (typeof value === 'object') {
      for (var newKey in value) {
        if (value.hasOwnProperty(newKey)) {
          findRoutes(key + separator + newKey, value[newKey], routes);
        }
      }
    }
    return routes;
  };
};

