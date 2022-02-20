const mongoose = require("mongoose");

// //schema
const projectSchema = new mongoose.Schema(
  {
    genre: { type: String, required: true },
    projNamePl: { type: String, required: true },
    projNameEn: { type: String, required: true },
    completionDate: { type: String, required: true }, //TODO: date ? also string?
    cityPl: { type: String, required: true },
    cityEn: { type: String, required: true },
    countryPl: { type: String, required: true },
    countryEn: { type: String, required: true },
    icoImgFull: { type: String, required: true },
    icoImgThumb: { type: String, required: true },
    type: { type: String, required: true },
    //GRAPHICS
    images: [
      {
        imageSourceFull: { type: String, required: true },
        imageSourceThumb: { type: String, required: true },
        imageAltPl: { type: String, required: true },
        imageAltEn: { type: String, required: true },
        isBig: { type: Boolean, required: true },
      },
    ],
    //ANIMATION
    videoSource: { type: String, required: true },
    videoSourceThumb: { type: String, required: true },
    //APP
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
    //PANORAMA
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
  },
  { strict: false }
);

module.exports = mongoose.model("Project", projectSchema);

// module.exports.Project = Project;
// module.exports.ProjectGraphic = ProjectGraphic;
// module.exports.ProjectAnimation = ProjectAnimation;
// module.exports.ProjectApp = ProjectApp;
// module.exports.ProjectPanorama = ProjectPanorama;
