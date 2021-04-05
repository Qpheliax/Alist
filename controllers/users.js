const User = require("../models/user"),
  rand = require("../utils/colorgenerator");

module.exports.renderRegister = (req, res) => {
  res.render("users/register", { pagetitle: `Animelist🌸Register` });
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, accountname, password } = req.body;
    const listname = accountname + "'s list";
    const usercolor = rand();

    const user = new User({
      email,
      username,
      accountname,
      listname,
      usercolor,
    });
    const registeredUser = await User.register(user, password);
    //! auto login after register
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome new user! :3");
      res.redirect(`/list/list${registeredUser._id}/page1`);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login", { pagetitle: `Animelist🌸Login` });
};

module.exports.login = (req, res) => {
  const UserId = req.user._id;
  req.flash("success", "Welcome back! :3");
  // * check required page and redirect after login
  const redirectUrl = req.session.returnTo || `/list/list${UserId._id}/page1`;
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  //! auto login out
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/");
};
