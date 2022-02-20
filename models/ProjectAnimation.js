const mongoose = require("mongoose");
const Project = require("./project");

const ProjectAnimation = Project.discriminator(
  "ProjectAnimation",
  new mongoose.Schema({
    videoSource: { type: String, required: true },
    videoSourceThumb: { type: String, required: true },
  })
);

module.exports = mongoose.model("ProjectAnimation");
