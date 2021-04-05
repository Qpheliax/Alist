const mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose"),
  uniqueValidator = require("mongoose-unique-validator"),
  Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    isAdmin: { type: Boolean, default: false },
    accountname: {
      type: String,
      max: [12, "Maximum 12 characters"],
      required: true,
      unique: true,
      uniqueCaseInsensitive: true,
    },
    listname: String,
    usercolor: String,
  },
  { timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(uniqueValidator, {
  message: "Error, {VALUE} not unique.",
});

module.exports = mongoose.model("User", UserSchema);
