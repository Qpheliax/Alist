const mongoose = require("mongoose"),
  Schema = mongoose.Schema,
  mongoosePaginate = require("mongoose-paginate-v2");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail_edit").get(function () {
  return this.url.replace("/upload", "/upload/w_100,h_150,c_fill");
});

const AnimetitleSchema = new Schema(
  {
    title: String,
    year: Number,
    images: [ImageSchema],
    description: String,
    rating: Number,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    listname: {
      type: Schema.Types,
      ref: "User",
    },
  },
  { timestamps: true }
);

AnimetitleSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Animetitle", AnimetitleSchema);
