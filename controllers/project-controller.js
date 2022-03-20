const type = require("../shared/type");
const genre = require("../shared/genre");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const Project = require("../models/project");
const ProjectGraphic = require("../models/ProjectGraphic");
const ProjectApp = require("../models/ProjectApp");
const ProjectPanorama = require("../models/ProjectPanorama");
const ProjectAnimation = require("../models/ProjectAnimation");

const URL_BASE = "http://localhost:5000/";

////logic
const getProjects = async (req, res, next) => {
  let projectsListMapped;
  try {
    projectsListMapped = await (
      await Project.find()
    ).map((project) => {
      return {
        id: project.id,
        genre: project.genre,
        projNamePl: project.projNamePl,
        projNameEn: project.projNameEn,
        completionDate: project.completionDate,
        cityPl: project.cityPl,
        cityEn: project.cityEn,
        countryPl: project.countryPl,
        countryEn: project.countryEn,
        icoImgFull: project.icoImgFull,
        icoImgThumb: project.icoImgThumb,
        projectType: project.projectType,
      };
    });
  } catch (err) {
    return next(
      new HttpError(
        `Something went wrong, could not find projects. (${err.message})`,
        500
      )
    );
  }

  if (!projectsListMapped || projectsListMapped.length === 0) {
    return next(
      new HttpError(
        "Could not find projects or list of projects is empty.",
        404
      )
    );
  }

  res.json({ projects: projectsListMapped });
};

const getProjectById = async (req, res, next) => {
  const projectId = req.params.projectId;

  let project;
  try {
    project = await Project.findById(projectId);
  } catch (err) {
    return next(
      new HttpError(
        `Something went wrong, could not find a project. (${err.message})`,
        500
      )
    );
  }

  if (!project) {
    return next(
      new HttpError("Could not find the project for the provided id.", 404)
    );
  }
  res.json({ project: project.toObject({ getters: true }) });
};

const createProject = async (req, res, next) => {
  console.log(req.body);
  console.log(req.files);
  //validating errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMessages = errors.errors.map((error) => {
      return {
        errorField: error.param,
        errorMessage: error.msg,
      };
    });
    return next(new HttpError(JSON.stringify(errorsMessages), 422));
    // return res.status(422).json(errorsMessages);
  }

  // creating logic
  const projectGenre = req.body.genre;
  const newProject = createNewProjectFactory(req, projectGenre);
  console.log(newProject);

  if (!newProject) {
    return next(
      new HttpError("Could not create project with provided genre", 400)
    );
  }

  try {
    // console.log(newProject);
    await newProject.save();
  } catch (err) {
    return next(
      new HttpError(
        `Creating project failed, please try again. (${err.message})`,
        500
      )
    );
  }

  res.status(201).json({ project: newProject });
};

const updateProjectById = async (req, res, next) => {
  //validating errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorsMessages = errors.errors.map((error) => {
      return {
        errorField: error.param,
        errorMessage: error.msg,
      };
    });

    return res.status(422).json(errorsMessages);
  }

  //updating logic
  const projectId = req.params.projectId;

  let existingProject;
  try {
    existingProject = await Project.findById(projectId);
  } catch (err) {
    return next(
      new HttpError(
        `Something went wrong, could not update a project. Most probably provided id was wrong. Details:  (${err.message})`,
        500
      )
    );
  }

  if (!existingProject || Object.keys(existingProject).length === 0) {
    return next(new HttpError("Could not find project with provided id.", 400));
  }

  if (existingProject.genre !== req.body.genre) {
    return next(
      new HttpError(
        "Could not update project, provided project's genre is different than existing one.",
        400
      )
    );
  }

  existingProject = updateProject(req, existingProject);

  try {
    await existingProject.save();
  } catch (err) {
    return next(
      new HttpError(
        `Something went wrong, could not update a project. (${err.message})`,
        500
      )
    );
  }

  res
    .status(201)
    .json({ project: existingProject.toObject({ getters: true }) });
};

const deleteProjectById = async (req, res, next) => {
  const projectId = req.params.projectId;

  let existingProject;
  try {
    existingProject = await Project.findById(projectId);
  } catch (err) {
    return next(
      new HttpError(
        `Something went wrong, could not delete a project. Most probably provided id was wrong. Details:  (${err.message})`,
        500
      )
    );
  }

  if (!existingProject || Object.keys(existingProject).length === 0) {
    return next(new HttpError("Could not find project with provided id.", 400));
  }

  try {
    await existingProject.remove();
  } catch (err) {
    return next(
      new HttpError(
        `Something went wrong, could not delete a project. Details: (${err.message})`,
        500
      )
    );
  }

  res.status(200).json({ message: "Project deleted." });
};

////utils
function updateProject(req, existingProject) {
  existingProject.projNamePl = req.body.projNamePl;
  existingProject.projNameEn = req.body.projNameEn;
  existingProject.completionDate = req.body.completionDate;
  existingProject.cityPl = req.body.cityPl;
  existingProject.cityEn = req.body.cityEn;
  existingProject.countryPl = req.body.countryPl;
  existingProject.countryEn = req.body.countryEn;
  existingProject.icoImgFull = req.body.icoImgFull;
  existingProject.icoImgThumb = req.body.icoImgThumb;
  existingProject.projectType = req.body.projectType;

  switch (req.body.genre) {
    case "GRAPHIC":
      existingProject.images = req.body.images;
      break;

    case "ANIMATION":
      existingProject.videoSource = req.body.videoSource;
      existingProject.videoSourceThumb = req.body.videoSourceThumb;
      break;

    case "APP":
      existingProject.appInfo = req.body.appInfo;
      break;

    case "PANORAMA":
      existingProject.panoramas = req.body.panoramas;
      break;
  }
  return existingProject;
}

function createNewProjectFactory(req, projectGenre) {
  const {
    genre,
    projNamePl,
    projNameEn,
    completionDate,
    cityPl,
    cityEn,
    clientPl,
    clientEn,
    countryPl,
    countryEn,
    icoImgFull,
    icoImgThumb,
    projectType,
  } = req.body;

  const newProjectCommons = {
    genre,
    projNamePl,
    projNameEn,
    completionDate,
    cityPl,
    cityEn,
    clientPl,
    clientEn,
    countryPl,
    countryEn,
    icoImgFull: req.files.find((file) => file.fieldname === "icoImgFull").path,
    icoImgThumb,
    projectType,
  };

  switch (projectGenre) {
    case "GRAPHIC":
      return new ProjectGraphic({
        ...newProjectCommons,
        images: req.body.images,
      });

    case "ANIMATION":
      return new ProjectAnimation({
        ...newProjectCommons,
        videoSource: req.body.videoSource,
        videoSourceThumb: req.body.videoSourceThumb,
      });

    case "APP":
      return new ProjectApp({
        ...newProjectCommons,
        appInfo: req.body.appInfo,
      });

    case "PANORAMA":
      return new ProjectPanorama({
        ...newProjectCommons,
        panoramas: req.body.panoramas,
      });

    default:
      return null;
  }
}

exports.getProjects = getProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.updateProjectById = updateProjectById;
exports.deleteProjectById = deleteProjectById;
