const type = require("../shared/type");
const genre = require("../shared/genre");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const sharp = require("sharp");
const Fs = require("fs");
const utils = require("../shared/utils");

const Project = require("../models/project");
const ProjectGraphic = require("../models/ProjectGraphic");
const ProjectApp = require("../models/ProjectApp");
const ProjectPanorama = require("../models/ProjectPanorama");
const ProjectAnimation = require("../models/ProjectAnimation");

const URL_BASE = "http://localhost:5000/";
const IMAGE_THUMB_ENUM = require("../shared/image-thumb-enum");

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
  }

  createThumbnails(req.files, next)
    .then(async () => {
      checkIfEveryFileExistsIncludingThumbnails(req.files, next);

      // creating logic
      console.log("staring creating file");
      const projectGenre = req.body.genre;
      const newProject = createNewProjectFactory(req, projectGenre);
      console.log(newProject);

      if (!newProject) {
        return next(
          new HttpError("Could not create project with provided genre", 400)
        );
      }

      try {
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
    })
    .catch((errorMessage) => {
      return next(new HttpError(errorMessage, 400));
    });
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

  const allImagesToDeleteArray = sdfsdf;

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

////
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
  console.log("body", req.body);
  console.log("files", req.files);

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
    icoImgFull: fillFieldWithPathOfUploadedFile(
      req.files,
      "icoImgFull",
      IMAGE_THUMB_ENUM.IMAGE_FULL
    ),
    icoImgThumb: fillFieldWithPathOfUploadedFile(
      req.files,
      "icoImgFull",
      IMAGE_THUMB_ENUM.IMAGE_THUMBNAIL
    ),
    projectType,
  };

  switch (projectGenre) {
    case "GRAPHIC":
      return new ProjectGraphic({
        ...newProjectCommons,
        images: fillGraphicArrayWithObjects(req.body, req.files),
      });

    case "ANIMATION":
      return new ProjectAnimation({
        ...newProjectCommons,
        videoSource: req.body.videoSource,
        videoSourceThumb: fillFieldWithPathOfUploadedFile(
          req.files,
          "videoSourceThumb",
          IMAGE_THUMB_ENUM.IMAGE_FULL
        ),
      });

    case "APP":
      return new ProjectApp({
        ...newProjectCommons,
        appInfo: fillAppObject(req.body.appInfo, req.files),
      });

    case "PANORAMA":
      return new ProjectPanorama({
        ...newProjectCommons,
        panoramas: fillPanoramaArrayWithObjects(req.body, req.files),
      });

    default:
      return null;
  }
}

function fillAppObject(bodyAppInfo, files) {
  return {
    appNamePl: bodyAppInfo.appNamePl,
    appNameEn: bodyAppInfo.appNameEn,
    appDescriptionPl: bodyAppInfo.appDescriptionPl,
    appDescriptionEn: bodyAppInfo.appDescriptionEn,
    appAndroidLink: bodyAppInfo.appAndroidLink,
    appIOSLink: bodyAppInfo.appIOSLink,
    appImageFull: fillFieldWithPathOfUploadedFile(
      files,
      "appInfo[appImageFull]",
      IMAGE_THUMB_ENUM.IMAGE_FULL
    ),
    appImageThumb: fillFieldWithPathOfUploadedFile(
      files,
      "appInfo[appImageFull]",
      IMAGE_THUMB_ENUM.IMAGE_THUMBNAIL
    ),
  };
}

function fillGraphicArrayWithObjects(body, filesArray) {
  return (imagesResult = body.images.map((image, index) => {
    return {
      imageAltPl: image.imageAltPl,
      imageAltEn: image.imageAltEn,
      isBig: image.isBig,
      imageSourceFull: fillFieldWithPathOfUploadedFile(
        filesArray,
        `images[${index}][imageSourceFull]`,
        IMAGE_THUMB_ENUM.IMAGE_FULL
      ),
      imageSourceThumb: fillFieldWithPathOfUploadedFile(
        filesArray,
        `images[${index}][imageSourceFull]`,
        IMAGE_THUMB_ENUM.IMAGE_THUMBNAIL
      ),
    };
  }));
}

function fillPanoramaArrayWithObjects(body, filesArray) {
  return body.panoramas.map((panorama, index) => {
    return {
      panoramaTitlePl: panorama.panoramaTitlePl,
      panoramaTitleEn: panorama.panoramaTitleEn,
      panoramaIcoFull: fillFieldWithPathOfUploadedFile(
        filesArray,
        `panoramas[${index}][panoramaIcoFull]`,
        IMAGE_THUMB_ENUM.IMAGE_FULL
      ),
      panoramaIcoThumb: fillFieldWithPathOfUploadedFile(
        filesArray,
        `panoramas[${index}][panoramaIcoFull]`,
        IMAGE_THUMB_ENUM.IMAGE_THUMBNAIL
      ),
      panoramaImageSourceFull: fillFieldWithPathOfUploadedFile(
        filesArray,
        `panoramas[${index}][panoramaImageSourceFull]`,
        IMAGE_THUMB_ENUM.IMAGE_FULL
      ),
      panoramaImageSourceFullThumb: fillFieldWithPathOfUploadedFile(
        filesArray,
        `panoramas[${index}][panoramaImageSourceFull]`,
        IMAGE_THUMB_ENUM.IMAGE_THUMBNAIL
      ),
    };
  });
}

function fillFieldWithPathOfUploadedFile(filesArray, formFieldName, imageType) {
  let pathResult = "";

  const fileFound = filesArray.find((file) => file.fieldname === formFieldName);

  if (fileFound) {
    switch (imageType) {
      case IMAGE_THUMB_ENUM.IMAGE_FULL:
        pathResult = fileFound.path;
        break;
      case IMAGE_THUMB_ENUM.IMAGE_THUMBNAIL:
        pathResult = utils.createPathOfThumbnailBasedOnFilePath(fileFound.path);
        break;
    }
  }

  return pathResult;
}

function createThumbnails(filesArray, next) {
  return new Promise((resolve, rejects) => {
    let imagesToProcessAmount = filesArray.length;

    filesArray.forEach((file) => {
      const thumbnailFileName =
        "uploads/images/" + file.filename.split(".")[0] + "__thumbnail";

      const thumbnailResult = sharp(file.path)
        .resize(100, 75)
        .toFormat("jpeg")
        .jpeg({ quality: 80 })
        .toFile(`${thumbnailFileName}.jpeg`)
        .then(() => {
          imagesToProcessAmount--;
          console.log({ thumbnailResult });
          if (imagesToProcessAmount === 0) resolve(true);
        })
        .catch((error) => {
          rejects(error.message);
        });
    });
  });
}

function checkIfEveryFileExistsIncludingThumbnails(filesArray, next) {
  filesArray.forEach((file) => {
    const index = __dirname.indexOf("backend\\");
    const pathBase = __dirname.slice(0, index + 8);
    //check file image
    const imagePath = pathBase + file.path;
    checkIfFileExistsAndThrowErrorIfNeeded(imagePath, next);
    //check thumbnail image
    const thumbnailFileName = `${file.path.split(".")[0]}__thumbnail.jpeg`;
    const thumbnailImagePath = pathBase + thumbnailFileName;
    checkIfFileExistsAndThrowErrorIfNeeded(thumbnailImagePath, next);
  });
}

function checkIfFileExistsAndThrowErrorIfNeeded(filePath, next) {
  try {
    if (Fs.existsSync(filePath)) return;
    else {
      console.log("error in try");
      return next(
        new HttpError(
          `Creation of files in server failed, try again please. file: ${filePath}`,
          500
        )
      );
    }
  } catch (error) {
    console.log("error in catch");
    return next(
      new HttpError(
        `Creation of files in server failed, try again please. file: ${filePath}`,
        500
      )
    );
  }
}

exports.getProjects = getProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.updateProjectById = updateProjectById;
exports.deleteProjectById = deleteProjectById;
