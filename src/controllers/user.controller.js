const userRepo = require("../repositories/user.repository");
const global = require('../util/constants').global;

module.exports.getRegisterUser = (req, res) => {
  res.status(200).render('user/register', {
    appName: global.app.name,
    pageTitle: 'Créer un Compte',
    errors: [],
    values: undefined
  });
};

module.exports.getLoginUser = (req, res) => {
  res.status(200).render('user/login', {
    appName: global.app.name,
    pageTitle: 'Connexion',
    errors: [],
    values: undefined,
    toasts: req.flash('toast')
  });
};

module.exports.getLogoutUser = (req, res) => {
  req.session.destroy();
  res.status(204).redirect('/');
};

module.exports.postRegisterUser = (req, res) => {
  const user = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  };

  if (!req.validation.success) {
    return res.status(422).render('user/register', {
      appName: global.app.name,
      pageTitle: 'Créer un Compte',
      errors: req.validation.errors,
      values: {username: user.username, email: user.email, password: user.password}
    });
  }

  userRepo
    .createUser(user)
    .then(result => {
      if (result.success) {
        req.flash('toast', 'Compte créé avec succès !');
        return res.status(201).redirect('/login');
      }
      res.send(result);
    })
    .catch(error => {
      console.error(error);
      res.status(500).redirect('/500');
    });
};

module.exports.postLoginUser = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  if (!req.validation.success) {
    return res.status(422).render('user/login', {
      appName: global.app.name,
      pageTitle: 'Connexion',
      errors: req.validation.errors,
      values: {email: user.email, password: user.password},
      toasts: req.flash('toast')
    });
  }

  userRepo
    .checkLogin(user)
    .then(result => {
      if (!result.success) {
        return res.status(401).render('user/login', {
          appName: global.app.name,
          pageTitle: 'Connexion',
          errors: [result.errors],
          values: {email: user.email, password: user.password},
          toasts: req.flash('toast')
        });
      }

      req.flash('toast', 'Bienvenue ' + result.user.username + ' !');
      req.session.user = result.user;
      res.redirect('/');
    })
    .catch(error => {
      console.error(error);
      res.status(500).redirect('/500');
    });
};
