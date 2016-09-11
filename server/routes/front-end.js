var createPage = require('../util/create-ejs-page');

module.exports = function (app, config, middleware) {

  var dashboard = createPage('dashboard', 'Briefings', [
    'public/js/vue.js',
    'public/js/moment.js',
    'public/js/saml-properties-for-frontend.js',
    'public/js/app.js',
    'public/js/dashboard.js',
  ]);

  app.get('/', middleware, dashboard);
};
