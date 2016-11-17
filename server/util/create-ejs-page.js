module.exports = function createPage (view, title, scripts, pageData) {
  var input = {
    title: title,
    page: view,
    pageData: pageData || {},
    scripts: scripts || [],
    activePages: {}
  };

  // decide which menu item activate
  var activeView = view;

  // highlight services when view is detail
  if (activeView == 'detail') input.activePages['services'] = 1;
  input.activePages[activeView] = 1;

  return function (req, res, next) {
      var organisationName;
      var username;
      var emailAddress;

    if (req.user) {
        organisationName = req.user.oNickname || '';
        emailAddress = req.user.mail;
        username = req.user.cn || '';
    } else {
        organisationName = 'organisatie';
        emailAddress = 'email@email.email';
        username = 'gebruiker';
    }

    input.organisationName = organisationName;
    input.username = username;
    input.emailAddress = emailAddress;

    res.render('base', input);
  }
};