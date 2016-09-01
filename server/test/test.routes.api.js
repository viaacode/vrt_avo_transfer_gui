var supertest = require('supertest');
var expect = require('chai').expect;

var configEnvironments = require('../config/config');
var appConfig = require('../app');

var FAKE_REQUEST = {
  error: function createRequestMockWhichReturns (statusCode, body) {
    return function requestMock (url, callback) {
      callback(null, {statusCode: statusCode}, body);
    }
  },
  success: function createRequestMockWhichReturns (body) {
    return function requestMock (url, callback) {
      callback(null, {statusCode: 200}, body);
    }
  }
};

function validateJsend (res) {
  expect(res).to.be.an('object');
  expect(res.body).to.be.an('object');
  expect(res.body).to.have.property('status');
  switch (res.body.status) {
    case 'success':
      expect(res.body).to.have.property('data');
      break;

    case 'fail':
      expect(res.body).to.have.property('data');
      break;

    case 'error':
      expect(res.body).to.have.property('message');
      break;

    default:
      expect().fail("status '" + res.body.status + "' not allowed");
  }
}

describe('routes/api', function () {
  var app;
  var request;
  var config;

  var paths = [
    '/api/stats',
    // mam items
    '/api/reports/mam/items/last-day',
    '/api/reports/mam/items/last-week',
    '/api/reports/mam/items/last-month',
    '/api/reports/mam/items/last-year',
    // mam bytes
    '/api/reports/mam/bytes/last-day',
    '/api/reports/mam/bytes/last-week',
    '/api/reports/mam/bytes/last-month',
    '/api/reports/mam/bytes/last-year',
    // ams items
    '/api/reports/ams/items/last-day',
    '/api/reports/ams/items/last-week',
    '/api/reports/ams/items/last-month',
    '/api/reports/ams/items/last-year'
  ];

  before(function () {
    config = configEnvironments('development');
    config.apiDelay = null;
    config.logErrors = false;
  });

  describe('success', function () {
    var input = {foo: "bar"};
    var expected = {status: "success", data: {"foo": "bar"}};

    before(function () {
      var request = FAKE_REQUEST.success(input);
      app = appConfig(config, request);
    });

    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];

      it(path + ' should wrap request in valid jsend', testWrapValidJsonFor(path));
    }

    function testWrapValidJsonFor (path) {
      return function (done) {
        supertest(app)
          .get(path)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(done);
      };
    }
  });

  describe('error', function () {
    var input = 'foo';
    var expected = {status: "error", message: '404 Not Found'};

    before(function () {
      var request = FAKE_REQUEST.error(404, input);
      app = appConfig(config, request);
    });

    for (var i = 0; i < paths.length; i++) {
      var path = paths[i];

      it(path + ' should show error in valid jsend', expectError(path));
    }

    function expectError (path) {
      return function (done) {
        supertest(app)
          .get(path)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(404)
          .expect(validateJsend)
          .expect(expected)
          .end(done);
      }
    }

    it('should error 404 when reports-service unknown', function (done) {
      var path = '/api/reports/foo/items/last-month';

      supertest(app)
        .get(path)
        .expect({
          status: 'error',
          message: '404 Not Found'
        })
        .expect(404)
        .end(done);
    });

    it('should error 404 when reports-what unknown', function (done) {
      var path = '/api/reports/mam/foo/last-month';

      supertest(app)
        .get(path)
        .expect({
          status: 'error',
          message: '404 Not Found'
        })
        .expect(404)
        .end(done);
    });

    it('should error 404 when reports-when unknown', function (done) {
      var path = '/api/reports/mam/items/foo';

      supertest(app)
        .get(path)
        .expect({
          status: 'error',
          message: '404 Not Found'
        })
        .expect(404)
        .end(done);
    });
  });

});

describe('authentication', function () {
  var app;
  var config = configEnvironments('dev_auth');

  beforeEach(function () {
    app = appConfig(config, null);
  });

  it('API should return HTTP 401 when not logged in', function (done) {
    supertest(app)
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Pages should redirect when not logged in', function (done) {

    supertest(app)
      .get('/dashboard')
      .expect(303)
      .expect('Location', '/login')
      .end(done);
  });

  it('js files should not redirect redirect when not logged in', function (done) {
    supertest(app)
      .get('/public/js/app.js')
      .expect(200)
      .end(done);
  });
});

describe('services available', function () {
  var app;
  var config;

  beforeEach(function () {
    config = configEnvironments('dev_auth');
    app = appConfig(config, null);
  });

  it('should return be config.fakeServicesAvailable when not logged in', function (done) {
    config.fakeServicesAvailable = {};

    var expected = 'var mijnVIAA=mijnVIAA||{};mijnVIAA.isServiceAvailable=function(serviceName){return {}[serviceName];};mijnVIAA.getOrganisationName=function(){return "";};';

    supertest(app)
      .get('/public/js/saml-properties-for-frontend.js')
      .expect(200)
      .expect(expected)
      .end(done);
  });

  it('should return req.user.apps when not logged in', function (done) {
    var inputServices = ['mediahaven', 'amsweb'];
    var expected = 'var mijnVIAA=mijnVIAA||{};mijnVIAA.isServiceAvailable=function(serviceName){return {"MAM":1,"AMS":1,"FTP":1}[serviceName];};mijnVIAA.getOrganisationName=function(){return "";};';

    var getAvailableServices;
    var app = {
      get: function (url, f) {
        getAvailableServices = f;
      }
    };

    require('../routes/saml-properties-for-frontend')(app, config);

    var req = {
      user: {
        apps: inputServices
      }
    };

    var res = {
      send: function (text) {
        expect(text).to.equal(expected);
        done();
      }
    };

    getAvailableServices(req, res, function () {
    });
  });
});

describe('DUMMY request', function () {
  var DUMMY;
  var app;
  var config;

  before(function () {
    config = configEnvironments('development');
    DUMMY = require('../dummy/dummy')(config);
    app = appConfig(config, DUMMY.request);
  });

  it('should generate reports when url from config.endpoints.reports', function (done) {
    supertest(app)
      .get('/api/reports/mam/items/last-month')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(validateJsend)
      .expect(function (res) {
        expect(res.body.data).to.have.property('y').to.equal('items');
        expect(res.body.data).to.have.property('reportType').to.equal('last-month');
        expect(res.body.data).to.have.property('data').to.be.an('array');
      })
      .end(done);
  });

  it('/api/stats should return json of correct form', function (done) {
    supertest(app)
      .get('/api/stats')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(validateJsend)
      .end(done);
  });
});
