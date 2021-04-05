const express = require("express"),
  router = express.Router({ mergeParams: true }),
  catchAsync = require("../utils/catchAsync"),
  thishome = require("../controllers/thishome");

router.route("/").get(catchAsync(thishome.home));

module.exports = router;
