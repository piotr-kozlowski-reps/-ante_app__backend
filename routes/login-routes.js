const express = require("express");
const loginControllers = require("../controllers/login-controller");

const router = express.Router();

router.post("/", loginControllers.login);
// router.get("/", projectControllers.getProjects);
// router.get("/:projectId", projectControllers.getProjectById);
// router.patch("/:projectId", projectControllers.updateProjectById);
// router.delete("/:projectId", projectControllers.deleteProjectById);

module.exports = router;
