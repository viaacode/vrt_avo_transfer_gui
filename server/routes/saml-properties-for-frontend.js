var _ = require('underscore');

module.exports = function (app, config) {
  app.get('/public/js/saml-properties-for-frontend.js', getSAMLInfo);

  function getSAMLInfo (req, res, next) {
    var organisationName;
    if (req.user) {
      organisationName = req.user.oNickname || '';
      username = req.user.cn;
    } else {
      organisationName = '';
      username = 'anoniem';
    }

    var vat = 'var vat={};vat.getOrganisationName=function(){return "' +
      organisationName +
      '";};vat.username="' + username + '";'

    res.send(vat);
  }
};
