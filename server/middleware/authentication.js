var status = {
  unauthorized: 401,
  redirect: 303
};

function ignore (req, res, next) {
  next();
}

function errorCode (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    return res.status(status.unauthorized).send('Not authenticated');
  }
}

function redirect (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    return res.redirect(status.redirect, '/login');
  }
}


module.exports = {
  ignore: ignore,
  errorCode: errorCode,
  redirect: redirect
};
