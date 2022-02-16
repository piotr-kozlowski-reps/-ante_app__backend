const { check } = require("express-validator");

const commonDataValidator = [
  check("genre")
    .isIn(["ANIMATION", "APP", "GRAPHIC", "PANORAMA"])
    .withMessage("provided project's genre is false "),
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
  check("countryPl").not().isEmpty().withMessage("countryPl cannot be empty."),
  check("countryEn").not().isEmpty().withMessage("countryEn cannot be empty."),
  check("icoImgFull")
    .not()
    .isEmpty()
    .withMessage("icoImgFull cannot be empty."),
  check("icoImgThumb")
    .not()
    .isEmpty()
    .withMessage("icoImgThumb cannot be empty."),
  check("type")
    .isIn([
      "COMPETITION",
      "INTERIOR",
      "EXTERIOR",
      "ANIMATION",
      "PRODUCT_MODELING",
      "PANORAMA",
      "APP",
    ])
    .withMessage("provided project's type is false"),
];

function checkAllIncomingData() {
  return () => {
    return [
      ...commonDataValidator,
      check("kuku").isEmpty().withMessage("kuku"),
    ];
  };
}

exports.checkAllIncomingData = checkAllIncomingData;
