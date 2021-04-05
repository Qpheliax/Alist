const express = require("express"),
  router = express.Router({ mergeParams: true }),
  { validateComment, isLoggedIn, isCommentAuthor } = require("../middleware"),
  catchAsync = require("../utils/catchAsync"),
  comments = require("../controllers/comments");

router.post(
  "/",
  isLoggedIn,
  validateComment,
  catchAsync(comments.createComment)
);

router.delete(
  "/:commentId",
  isLoggedIn,
  isCommentAuthor,
  catchAsync(comments.deleteComment)
);

module.exports = router;
