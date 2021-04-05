const Animetitle = require("../models/model");

module.exports.home = async (req, res) => {
  const lists = await Animetitle.aggregate([
    {
      $group: {
        _id: "$author",
        sum: { $sum: 1 },
        detail: { $first: "$$ROOT" },
      },
    },
  ]);

  res.render("home", {
    lists,
    pagetitle: "Animelist🌸Home page",
  });
};
