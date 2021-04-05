const express = require("express"),
  router = express.Router(),
  multer = require("multer"),
  { storage } = require("../cloudinary"),
  upload = multer({ storage }).array("images"),
  catchAsync = require("../utils/catchAsync"),
  { isLoggedIn, isAuthor, validateTitle } = require("../middleware"),
  animetitles = require("../controllers/animetitles");

router
  .route("/list:id/page:page")
  .get(catchAsync(animetitles.index))
  .post(
    isLoggedIn,
    upload,
    validateTitle,
    catchAsync(animetitles.createAnimeTitle)
  );

//! /new comes before /:id
router.get(
  "/list:id/page:page/new",
  isLoggedIn,
  animetitles.renderNewAnimeTitleForm
);

router
  .route("/list:id/page:page/title:id")
  .get(isLoggedIn, catchAsync(animetitles.detailsOfAnimetitle))
  .put(
    isLoggedIn,
    isAuthor,
    upload,
    validateTitle,
    catchAsync(animetitles.updateAnimeTitle)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(animetitles.deleteAnimeTitle));

router.get(
  "/list:id/page:page/title:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(animetitles.renderAnimeTitleEditForm)
);

module.exports = router;
