const Joi = require("joi"),
  sanitizeHtml = require("sanitize-html");

//remove tags from text fields extension (sanitizeHtml)
const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#value}} <- must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});

const JoiX = Joi.extend(extension);

module.exports.titleSchema = JoiX.object({
  animetitle: JoiX.object({
    title: JoiX.string().required().escapeHTML(),
    year: JoiX.number().required().min(0),
    // img: Joi.string().required(),
    description: JoiX.string().required().escapeHTML(),
    rating: JoiX.number().required().min(1).max(5),
  }).required(),
  deleteImages: JoiX.array(),
});

module.exports.commentSchema = JoiX.object({
  comment: JoiX.object({
    body: JoiX.string().required().escapeHTML(),
  }).required(),
});
