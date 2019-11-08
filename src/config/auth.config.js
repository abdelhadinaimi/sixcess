module.exports.isAuth = (req, res, next) => {
  if (!req.session.user)
    return res.status(401).redirect('/');
  next();
};

module.exports.isNotAuth = (req, res, next) => {
  if (req.session.user)
    return res.status(401).redirect('/');
  next();
};