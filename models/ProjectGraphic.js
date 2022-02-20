const mongoose = require("mongoose");
const Project = require("./project");

const ProjectGraphic = Project.discriminator(
  "ProjectGraphic",
  new mongoose.Schema({
    images: [
      {
        imageSourceFull: { type: String, required: true },
        imageSourceThumb: { type: String, required: true },
        imageAltPl: { type: String, required: true },
        imageAltEn: { type: String, required: true },
        isBig: { type: Boolean, required: true },
      },
    ],
  })
);

module.exports = mongoose.model("ProjectGraphic");
