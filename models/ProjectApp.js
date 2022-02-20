const mongoose = require("mongoose");
const Project = require("./project");

const ProjectApp = Project.discriminator(
  "ProjectApp",
  new mongoose.Schema({
    appInfo: {
      appNamePl: { type: String, required: true },
      appNameEn: { type: String, required: true },
      appImageFull: { type: String, required: true },
      appImageThumb: { type: String, required: true },
      appDescriptionPl: { type: String, required: true },
      appDescriptionEn: { type: String, required: true },
      appAndroidLink: { type: String, required: true },
      appIOSLink: { type: String, required: true },
    },
  })
);

module.exports = mongoose.model("ProjectApp");
