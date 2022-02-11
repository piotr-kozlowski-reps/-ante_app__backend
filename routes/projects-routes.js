const express = require("express");

const router = express.Router();

//DUMMIES
const DUMMY_PROJECTS = require("../DUMMIES/projects-dummy-data");

router.get("/", (req, res, next) => {
  console.log("get request in projects");
  res.json({ message: "it works!!" });
});

module.exports = router;
