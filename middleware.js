const Animetitle = require("./models/model"),
  Comment = require("./models/comment"),
  { titleSchema, commentSchema } = require("./joiSchemas"),
  multer = require("multer"),
  ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //*store location
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const animetitle = await Animetitle.findById(id);
  if (animetitle.author.equals(req.user._id) || req.user.isAdmin) {
    next();
  } else {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/list/list${id}`);
  }
};

module.exports.isCommentAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (comment.author.equals(req.user._id) || req.user.isAdmin) {
    next();
  } else {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/list/list${id}`);
  }
};

module.exports.validateTitle = (req, res, next) => {
  const { error } = titleSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateComment = async (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
