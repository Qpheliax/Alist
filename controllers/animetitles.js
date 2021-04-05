const Animetitle = require("../models/model"),
  User = require("../models/user"),
  { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const { id } = req.params;

  const page = req.params.page || 1;
  const r_limit = req.params.limit || 16;
  const limit = parseInt(r_limit);

  const options = {
    page: page,
    limit: limit,
    sort: { createdAt: 1 },
  };

  const results = await Animetitle.paginate({ author: id }, options);
  const userlist = await User.findById(id);
  const title = userlist.listname;

  res.render("animetitles/index", {
    results,
    userlist,
    title,
    pagenumber: page,
    userId: userlist._id,
    pagetitle: `Animelist🌸${title}`,
    total: results.totalDocs,
    limit: results.limit,
    page: results.page,
    pages: results.totalPages,
    result: results.docs,
  });
};

module.exports.renderNewAnimeTitleForm = (req, res) => {
  const page = req.params.page || 1;
  res.render("animetitles/new", {
    pagenumber: page,
    pagetitle: `Animelist🌸New`,
  });
};

module.exports.createAnimeTitle = async (req, res) => {
  const pagenumber = req.params.page || 1;
  const animetitle = new Animetitle(req.body.animetitle);
  animetitle.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  animetitle.author = req.user._id;
  animetitle.listname = req.user.listname;
  const UserId = req.user._id;
  await animetitle.save();
  req.flash("success", "Successfully registered a new title! :3");
  res.redirect(
    `/list/list${UserId._id}/page${pagenumber}/title${animetitle._id}`
  );
};

module.exports.detailsOfAnimetitle = async (req, res) => {
  const { id } = req.params;
  const pagenumber = req.params.page || 1;

  const UserId = req.user._id;
  const animetitle = await Animetitle.findById(id)
    .populate({
      path: "comments",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  const name = animetitle.title;
  if (!animetitle) {
    req.flash("error", "Cannot find this title. Probably deleted qq");
    return res.redirect(`/list/list${UserId._id}`);
  }
  res.render("animetitles/details", {
    animetitle,
    pagenumber,
    pagetitle: `Animelist🌸Details of ${name}`,
  });
};

module.exports.renderAnimeTitleEditForm = async (req, res) => {
  const { id } = req.params;
  const UserId = req.user._id;
  const pagenumber = req.params.page || 1;
  const animetitle = await Animetitle.findById(id);
  if (!animetitle) {
    req.flash("error", "Cannot find this title. Probably deleted qq");
    return res.redirect(`/list/list${UserId._id}/page${pagenumber}`);
  }
  res.render("animetitles/edit", {
    animetitle,
    pagenumber,
    pagetitle: `Animelist🌸Edit`,
  });
};

module.exports.updateAnimeTitle = async (req, res) => {
  const { id } = req.params;
  const UserId = req.user._id;
  const pagenumber = req.params.page || 1;
  const animetitle = await Animetitle.findByIdAndUpdate(id, {
    ...req.body.animetitle,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  animetitle.images.push(...imgs);
  await animetitle.save();

  if (req.body.deleteImages) {
    const totalLength = await animetitle.images.length;
    const deleteLength = await req.body.deleteImages.length;
    if (deleteLength >= totalLength) {
      req.flash("error", "You must have at least one image!");
      res.redirect(
        `/list/list${UserId._id}/page${pagenumber}/title${animetitle._id}/edit`
      );
    } else {
      for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename);
      }
      await animetitle.updateOne({
        $pull: { images: { filename: { $in: req.body.deleteImages } } },
      });
    }
  }

  req.flash("success", "Successfully updated a title! :3");
  res.redirect(
    `/list/list${UserId._id}/page${pagenumber}/title${animetitle._id}`
  );
};

module.exports.deleteAnimeTitle = async (req, res) => {
  const { id } = req.params;
  const UserId = req.user._id;
  const pagenumber = req.params.page || 1;
  await Animetitle.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted a title! :3");
  res.redirect(`/list/list${UserId._id}/page${pagenumber}`);
};
