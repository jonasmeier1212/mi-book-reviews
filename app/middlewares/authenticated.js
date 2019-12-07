function authenticated(req, res, next) {
  if (!req.session.user_id) {
    res.redirect("/user/login");
    return;
  }
  console.log("Session", req.session);
  next();
}

exports.authenticated = authenticated;
