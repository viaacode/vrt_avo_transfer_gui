var createPage = require('../util/create-ejs-page');

module.exports = function (app, config, middleware) {

  var dashboard = createPage('dashboard', 'Reports - Mijn VIAA', [
    'public/js/vue.js',
    'public/js/moment.js',
    'public/js/chart.js',
    'public/js/saml-properties-for-frontend.js',
    'public/js/app.js',
    'public/js/dashboard-config.js',
    'public/js/dashboard.js',
  ]);
  var services = createPage('services', 'Diensten - Mijn VIAA', [
    'public/js/vue.js',
    'public/js/saml-properties-for-frontend.js',
    'public/js/app.js',
    'public/js/moment.js',
    'public/js/services-config.js',
    'public/js/services-overview.js'
  ]);
  var detail = createPage('detail', 'Mijn VIAA', [
    'public/js/vue.js',
    'public/js/saml-properties-for-frontend.js',
    'public/js/app.js',
    'public/js/services-config.js',
    'public/js/services-detail.js'
  ]);


  app.get('/', middleware, dashboard);
  app.get('/dashboard', middleware, dashboard);
  app.get('/services', middleware, services);
  app.get('/detail', middleware, detail);
};
