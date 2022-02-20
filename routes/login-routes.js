const express = require("express");
const loginControllers = require("../controllers/login-controller");

const router = express.Router();

router.post("/", loginControllers.login);

module.exports = router;
