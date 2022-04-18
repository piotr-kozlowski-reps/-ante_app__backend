const express = require("express");
const { check, body } = require("express-validator");
const contactControllers = require("../controllers/contact-controller");

const router = express.Router();

////utils
//checks
const checks = [
  check("name").not().isEmpty().withMessage("Name cannot be empty."),
  check("surname").not().isEmpty().withMessage("Surname cannot be empty."),
  check("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("Name cannot be empty."),
  check("textContent").not().isEmpty().withMessage("Name cannot be empty."),
  check("lang")
    .isIn(["pl", "en"])
    .withMessage("Language should be 'pl' or 'en'."),
];

router.post("/", checks, contactControllers.contact);

module.exports = router;
