const mongoose = require("mongoose");
const Project = require("./project");

const ProjectPanorama = Project.discriminator(
  "ProjectPanorama",
  new mongoose.Schema({
    panoramas: [
      {
        panoramaTitlePl: { type: String, required: true },
        panoramaTitleEn: { type: String, required: true },
        panoramaIcoFull: { type: String, required: true },
        panoramaIcoThumb: { type: String, required: true },
        panoramaImageSourceFull: { type: String, required: true },
        panoramaImageSourceFullThumb: { type: String, required: true },
      },
    ],
  })
);

module.exports = mongoose.model("ProjectPanorama");
