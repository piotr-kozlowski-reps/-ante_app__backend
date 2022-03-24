const express = require("express");
const { check, body } = require("express-validator");

const projectControllers = require("../controllers/project-controller");
const fileUpload = require("../middleware/file-upload");

////utils
//checks
const checks = [
  check("genre")
    .isIn(["ANIMATION", "APP", "GRAPHIC", "PANORAMA"])
    .withMessage("provided project's genre is false."),
  check("projNamePl")
    .not()
    .isEmpty()
    .withMessage("projNamePl cannot be empty."),
  check("projNameEn")
    .not()
    .isEmpty()
    .withMessage("projNameEn cannot be empty."),
  check("completionDate")
    .not()
    .isEmpty()
    .withMessage("completionDate must be valid"), //TODO: completion date validation!
  check("cityPl").not().isEmpty().withMessage("cityPl cannot be empty."),
  check("cityEn").not().isEmpty().withMessage("cityEn cannot be empty."),
  check("clientPl").not().isEmpty().withMessage("clientPl cannot be empty."),
  check("clientEn").not().isEmpty().withMessage("clientEn cannot be empty."),
  check("countryPl").not().isEmpty().withMessage("countryPl cannot be empty."),
  check("countryEn").not().isEmpty().withMessage("countryEn cannot be empty."),
  //TODO: temporarily turned off check for files -> check it further later
  // check("icoImgFull")
  //   .custom((value, { req }) => {
  //     if (
  //       req.file.mimetype === "image/png" ||
  //       req.file.mimetype === "image/jpeg" ||
  //       req.file.mimetype === "image/jpg" ||
  //       req.file.mimetype === "image/gif"
  //     )
  //       return true;
  //     else return false;
  //   })
  //   .withMessage(
  //     "Please submit only image file with format: .png | .jpg | .jpeg | .gif"
  //   ),
  // check("icoImgFull")
  //   .not()
  //   .isEmpty()
  //   .withMessage("icoImgFull cannot be empty."),
  check("projectType")
    .isArray({ min: 1 })
    .withMessage("at least one type must be provided")
    .custom((value, { req }) => customTypeValidation(req.body.projectType))
    .withMessage("provided project's type is false"),

  //animation
  check("videoSource")
    .if((value, { req }) => req.body.genre === "ANIMATION")
    .notEmpty()
    .withMessage("video source must be provided"),
  //TODO: temporarily turned off check for files -> check it further later
  // check("videoSourceThumb")
  //   .if((value, { req }) => req.body.genre === "ANIMATION")
  //   .notEmpty()
  //   .withMessage("video source thumbnail must be provided"),

  //app
  check("appInfo.appNamePl")
    .if((value, { req }) => req.body.genre === "APP")
    .notEmpty()
    .withMessage("application name (in polish) cannot be empty."),
  check("appInfo.appNameEn")
    .if((value, { req }) => req.body.genre === "APP")
    .notEmpty()
    .withMessage("application name (in english) cannot be empty."),
  // check("appInfo.appImageFull")
  //   .if((value, { req }) => req.body.genre === "APP")
  //   .notEmpty()
  //   .withMessage("application image source must be provided."),
  // check("appInfo.appImageThumb")
  //   .if((value, { req }) => req.body.genre === "APP")
  //   .notEmpty()
  //   .withMessage("application image thumbnail source must be provided."),
  check("appInfo.appDescriptionPl")
    .if((value, { req }) => req.body.genre === "APP")
    .notEmpty()
    .withMessage("application description (in polish) cannot be empty."),
  check("appInfo.appDescriptionEn")
    .if((value, { req }) => req.body.genre === "APP")
    .notEmpty()
    .withMessage("application description (in english) cannot be empty."),
  check("appInfo.appAndroidLink")
    .if((value, { req }) => req.body.genre === "APP")
    .notEmpty()
    .withMessage("link to android application must be provided."),
  check("appInfo.appIOSLink")
    .if((value, { req }) => req.body.genre === "APP")
    .notEmpty()
    .withMessage("link to iOS application must be provided."),

  //graphic
  check("images")
    .if((value, { req }) => req.body.genre === "GRAPHIC")
    .isArray({ min: 1 })
    .withMessage("at least one image must be provided."),
  // check("images.*.imageSourceFull")
  //   .if((value, { req }) => req.body.genre === "GRAPHIC")
  //   .notEmpty()
  //   .withMessage("image source must be provided."),
  // check("images.*.imageSourceThumb")
  //   .if((value, { req }) => req.body.genre === "GRAPHIC")
  //   .notEmpty()
  //   .withMessage("image source thumbnail must be provided."),
  check("images.*.imageAltPl")
    .if((value, { req }) => req.body.genre === "GRAPHIC")
    .notEmpty()
    .withMessage("image description (ALT) (in polish) cannot be empty."),
  check("images.*.imageAltEn")
    .if((value, { req }) => req.body.genre === "GRAPHIC")
    .notEmpty()
    .withMessage("image description (ALT) (in english) cannot be empty."),
  check("images.*.isBig")
    .if((value, { req }) => req.body.genre === "GRAPHIC")
    .isBoolean()
    .withMessage("isBig has to be a boolean value."),

  //panorama
  check("panoramas")
    .if((value, { req }) => req.body.genre === "PANORAMA")
    .isArray({ min: 1 })
    .withMessage("at least one panorama image must be provided."),
  check("panoramas.*.panoramaTitlePl")
    .if((value, { req }) => req.body.genre === "PANORAMA")
    .notEmpty()
    .withMessage("panoramaTitlePl cannot be empty."),
  check("panoramas.*.panoramaTitleEn")
    .if((value, { req }) => req.body.genre === "PANORAMA")
    .notEmpty()
    .withMessage("image description (ALT) (in english) cannot be empty."),
  // check("panoramas.*.panoramaIcoFull")
  //   .if((value, { req }) => req.body.genre === "PANORAMA")
  //   .notEmpty()
  //   .withMessage("panorama icon source file must be provided."),
  // check("panoramas.*.panoramaIcoThumb")
  //   .if((value, { req }) => req.body.genre === "PANORAMA")
  //   .notEmpty()
  //   .withMessage("panorama icon thumbnail source file must be provided."),
  // check("panoramas.*.panoramaImageSourceFull")
  //   .if((value, { req }) => req.body.genre === "PANORAMA")
  //   .notEmpty()
  //   .withMessage("panorama image source file must be provided."),
  // check("panoramas.*.panoramaImageSourceFullThumb")
  //   .if((value, { req }) => req.body.genre === "PANORAMA")
  //   .notEmpty()
  //   .withMessage("panorama image thumbnail source file must be provided."),
];
//types validation
const typesValidValues = [
  "COMPETITION",
  "INTERIOR",
  "EXTERIOR",
  "ANIMATION",
  "PRODUCT_MODELING",
  "PANORAMA",
  "APP",
];
function customTypeValidation(typesArray) {
  let isValid = true;

  //is equal to one of valid types
  typesArray.forEach((el) => {
    let amountOfAppearancesInValidArray = 0;

    typesValidValues.forEach((typeValid) => {
      if (el === typeValid) amountOfAppearancesInValidArray++;
    });

    if (amountOfAppearancesInValidArray === 0) isValid = false;
  });

  return isValid;
}

////router
const router = express.Router();

router.get("/", projectControllers.getProjects);
router.post("/", fileUpload.any(), checks, projectControllers.createProject);

router.get("/:projectId", projectControllers.getProjectById);
router.patch("/:projectId", checks, projectControllers.updateProjectById);
router.delete("/:projectId", projectControllers.deleteProjectById);

module.exports = router;
