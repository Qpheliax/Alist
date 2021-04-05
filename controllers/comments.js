const Animetitle = require("../models/model"),
  Comment = require("../models/comment");

module.exports.createComment = async (req, res) => {
  const { id } = req.params;
  const UserId = req.user._id;
  const pagenumber = req.params.page || 1;
  const animetitle = await Animetitle.findById(id);
  const comment = new Comment(req.body.comment);
  comment.author = req.user._id;
  animetitle.comments.push(comment);
  await comment.save();
  await animetitle.save();
  req.flash("success", "Created a new comment! :3");
  res.redirect(
    `/list/list${UserId._id}/page${pagenumber}/title${animetitle._id}`
  );
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  const UserId = req.user._id;
  const pagenumber = req.params.page || 1;
  await Animetitle.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash("success", "Successfully deleted a comment");
  res.redirect(`/list/list${UserId._id}/page${pagenumber}/title${id}`);
};
