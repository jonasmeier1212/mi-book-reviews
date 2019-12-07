function authenticated(req, res, next) {
  if (!req.session.user_id) {
    res.redirect("/user/login");
    return;
  }
  next();
}

exports.authenticated = authenticated;
