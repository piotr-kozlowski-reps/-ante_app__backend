const mongoose = require("mongoose");

const baseOptions = {
  discriminatorKey: "projectGenre",
  collections: "projects",
};

//base Project schema
const Project = mongoose.model(
  "Project",
  new mongoose.Schema(
    {
      genre: { type: String, required: true },
      projNamePl: { type: String, required: true },
      projNameEn: { type: String, required: true },
      completionDate: {
        type: Date,
        required: true,
        min: "1990-01-01",
        max: "2050-01-01",
      },
      cityPl: { type: String, required: true },
      cityEn: { type: String, required: true },
      clientPl: { type: String, required: true },
      clientEl: { type: String, required: true },
      countryPl: { type: String, required: true },
      countryEn: { type: String, required: true },
      icoImgFull: { type: String, required: true },
      icoImgThumb: { type: String, required: true },
      projectType: { type: Array, required: true },
    },
    baseOptions
  )
);

module.exports = mongoose.model("Project");
