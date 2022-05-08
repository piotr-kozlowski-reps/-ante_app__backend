const type = require("../shared/type");
const genre = require("../shared/genre");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const sharp = require("sharp");
const Fs = require("fs");
const utils = require("../shared/utils");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const _ = require("lodash");

const Project = require("../models/project");
const ProjectGraphic = require("../models/ProjectGraphic");
const ProjectApp = require("../models/ProjectApp");
const ProjectPanorama = require("../models/ProjectPanorama");
const ProjectAnimation = require("../models/ProjectAnimation");

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
  // //validating errors
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

  // creating logic
  const projectGenre = req.body.genre;
  const newProject = createNewProjectFactory(req, projectGenre);

  if (!newProject) {
    return next(
      new HttpError("Could not create project with provided genre", 400)
    );
  }

  //checking if all images are present in cloudinary
  const allImagesIDisArray = getAllImagesIDis(newProject);
  try {
    const areImagesExisting = await checkAllImagesIfTheyExist(
      allImagesIDisArray
    );
    if (!areImagesExisting)
      return new HttpError(
        `Creating project failed, some of external images don't exist on cloudinary server. (${err.message})`,
        500
      );
  } catch (err) {
    return next(
      new HttpError(
        `Creating project failed, some of external images don't exist on cloudinary server. (${err.message})`,
        500
      )
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

  const projectGenre = req.body.genre;
  const newProject = createNewProjectFactory(req, projectGenre);

  /*
   *creating array of images:
   * that has changed and are useless(to be deleted)
   * that haven't changed and the new ones (to be checked if they exist)
   */
  const arrayOfImagesFromExistingProject = getAllImagesIDis(existingProject);
  const arrayOfImagesFromNewProjectArray = getAllImagesIDis(newProject);

  const arrayOfNewImages = _.difference(
    arrayOfImagesFromNewProjectArray,
    arrayOfImagesFromExistingProject
  );

  const arrayOfImagesToBeDeleted = _.difference(
    arrayOfImagesFromExistingProject,
    arrayOfImagesFromNewProjectArray
  );
  getRidOfDuplicates(arrayOfImagesToBeDeleted);

  console.log({ arrayOfImagesFromExistingProject });
  console.log({ arrayOfImagesFromNewProjectArray });
  console.log({ existingProject });
  console.log({ newProject });
  console.log({ arrayOfNewImages });
  console.log({ arrayOfImagesToBeDeleted });

  //check if all images exist
  try {
    const isImagesExist = await checkAllImagesIfTheyExist(arrayOfNewImages);
    if (!isImagesExist)
      return new HttpError(
        `Creating project failed, some of external images don't exist on cloudinary server. (${err.message})`,
        500
      );
  } catch (err) {
    return next(
      new HttpError(
        `Creating project failed, some of external images don't exist on cloudinary server. (${err.message})`,
        500
      )
    );
  }

  // updating Project
  existingProject = updateProjectHelper(req, existingProject);

  // write project and return json
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

  //delete unused images from cloudinary
  await cloudinary.api.delete_resources(
    arrayOfImagesToBeDeleted,
    (error, result) => {
      console.log(result, error);
    }
  );

  //response
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
  const pathsOfAllFilesToBeDeleted =
    extractPathsOfAllExternalFilesInCloudinary(existingProject);

  const extractedIDisArrayFromPath = extractIDisFromPath(
    pathsOfAllFilesToBeDeleted
  );

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

  await cloudinary.api.delete_resources(
    extractedIDisArrayFromPath,
    (error, result) => {
      console.log(result, error);
    }
  );

  res.status(200).json({ message: "Project deleted." });
};

////
////utils
function updateProjectHelper(req, existingProject) {
  console.log("body", req.body);

  existingProject.projNamePl = req.body.projNamePl;
  existingProject.projNameEn = req.body.projNameEn;
  existingProject.completionDate = req.body.completionDate;
  existingProject.cityPl = req.body.cityPl;
  existingProject.cityEn = req.body.cityEn;
  existingProject.countryPl = req.body.countryPl;
  existingProject.countryEn = req.body.countryEn;
  existingProject.icoImgFull = req.body.icoImgFull;
  existingProject.icoImgThumb = req.body.icoImgFull;
  existingProject.projectType = req.body.icoImgThumb;

  switch (req.body.genre) {
    case "ANIMATION":
      existingProject.videoSource = req.body.videoSource;
      existingProject.videoSourceThumb = req.body.videoSourceThumb;
      break;

    case "GRAPHIC":
      existingProject.images = updateGraphicArrayWithObjects(req.body);
      break;

    case "APP":
      existingProject.appInfo = updateAppObjectWithData(req.body);

      break;

    case "PANORAMA":
      existingProject.panoramas = updatePanoramaArrayWithObjects(req.body);
      break;
  }
  return existingProject;
}

function createNewProjectFactory(req, projectGenre) {
  // console.log("body", req.body);

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
    icoImgFull,
    icoImgThumb,
    projectType,
  };

  switch (projectGenre) {
    case "GRAPHIC":
      return new ProjectGraphic({
        ...newProjectCommons,
        images: fillGraphicArrayWithObjects(req.body),
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
        appInfo: fillAppObject(req.body.appInfo),
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

function fillAppObject(bodyAppInfo) {
  return {
    appNamePl: bodyAppInfo.appNamePl,
    appNameEn: bodyAppInfo.appNameEn,
    appDescriptionPl: bodyAppInfo.appDescriptionPl,
    appDescriptionEn: bodyAppInfo.appDescriptionEn,
    appAndroidLink: bodyAppInfo.appAndroidLink,
    appIOSLink: bodyAppInfo.appIOSLink,
    appImageFull: bodyAppInfo.appImageFull,
    appImageThumb: bodyAppInfo.appImageThumb,
  };
}

function updateAppObjectWithData(body) {
  return {
    appNamePl: body.appInfo["appNamePl"],
    appNameEn: body.appInfo["appNameEn"],
    appDescriptionPl: body.appInfo["appDescriptionPl"],
    appDescriptionEn: body.appInfo["appDescriptionEn"],
    appAndroidLink: body.appInfo["appAndroidLink"],
    appIOSLink: body.appInfo["appIOSLink"],
    appImageFull: body.appInfo["appImageFull"],
    appImageThumb: body.appInfo["appImageThumb"],
  };
}

function fillGraphicArrayWithObjects(body) {
  return body.images.map((image) => {
    return {
      imageAltPl: image.imageAltPl,
      imageAltEn: image.imageAltEn,
      isBig: image.isBig,
      imageSourceFull: image.imageSourceFull,
      imageSourceThumb: image.imageSourceThumb,
    };
  });
}

function updateGraphicArrayWithObjects(body) {
  return body.images.map((image, index) => {
    return {
      imageAltPl: image.imageAltPl,
      imageAltEn: image.imageAltEn,
      isBig: image.isBig,
      imageSourceFull: image.imageSourceFull,
      imageSourceThumb: image.imageSourceThumb,
    };
  });
}

function fillPanoramaArrayWithObjects(body, filesArray) {
  return body.panoramas.map((panorama, index) => {
    return {
      panoramaTitlePl: panorama.panoramaTitlePl,
      panoramaTitleEn: panorama.panoramaTitleEn,
      panoramaIcoFull: panorama.panoramaIcoFull,
      panoramaIcoThumb: panorama.panoramaIcoThumb,
      panoramaImageSourceFull: panorama.panoramaImageSourceFull,
      panoramaImageSourceFullThumb: panorama.panoramaImageSourceFullThumb,
    };
  });
}

function updatePanoramaArrayWithObjects(body) {
  return body.panoramas.map((panorama, index) => {
    return {
      panoramaTitlePl: panorama.panoramaTitlePl,
      panoramaTitleEn: panorama.panoramaTitleEn,
      panoramaIcoFull: panorama.panoramaIcoFull,
      panoramaIcoThumb: panorama.panoramaIcoThumb,
      panoramaImageSourceFull: panorama.panoramaImageSourceFull,
      panoramaImageSourceFullThumb: panorama.panoramaImageSourceFullThumb,
    };
  });
}

function fillFieldWithPathOfUploadedFile(
  filesArray,
  formFieldName,
  fieldData,
  imageType,
  existingProject
) {
  let pathResult = "";

  //check if fieldData is provided, if it is string and if file with provided path exists,
  //return that path
  if (
    fieldData &&
    Object.prototype.toString.call(fieldData) === "[object String]"
  ) {
    try {
      if (Fs.existsSync(fieldData)) {
        switch (imageType) {
          case IMAGE_THUMB_ENUM.IMAGE_FULL:
            pathResult = fieldData;
            return pathResult;
          case IMAGE_THUMB_ENUM.IMAGE_THUMBNAIL:
            pathResult = utils.createPathOfThumbnailBasedOnFilePath(fieldData);
            return pathResult;
        }
      }

      if (!filesArray.find((file) => file.fieldname === formFieldName)) {
        console.log("error in try");
        return next(
          new HttpError(
            `There's no file on server with provided path and no file provided. Try again please. file: ${fieldData}`,
            500
          )
        );
      }
    } catch (error) {
      console.log("error in catch");
      return next(
        new HttpError(
          `Checking if file exists on server failed, try again please. file: ${filePath}`,
          500
        )
      );
    }
  }

  //if fieldData is not a string - but a file
  //At first delete old file and it's thumbnail and path of newly create file
  //return  path of newly created file
  const fileFound = filesArray.find((file) => file.fieldname === formFieldName);

  if (fileFound) {
    //delete old files if existing project provided
    if (existingProject) {
      console.log("deleting old file");

      //deleting image
      const fileToBeDeletedPath = eval(
        `existingProject.${createGoodPathToExtractValueFromObject(
          formFieldName
        )}`
      );

      if (Fs.existsSync(fileToBeDeletedPath)) {
        Fs.unlink(fileToBeDeletedPath, (err) => {
          console.log(err);
        });
      }

      //delete of thumbnail image
      const thumbnailToBeDeletedPath =
        utils.createPathOfThumbnailBasedOnFilePath(fileToBeDeletedPath);

      if (Fs.existsSync(thumbnailToBeDeletedPath)) {
        Fs.unlink(thumbnailToBeDeletedPath, (err) => {
          console.log(err);
        });
      }
    }

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

// function extractPathsOfAllFilesToBeDeleted(obj, pathsOfAllFilesToBeDeleted) {
//   Object.keys(obj).forEach((key) => {
//     const isString =
//       Object.prototype.toString.call(obj[key]) === "[object String]";

//     if (isString && obj[key].startsWith("uploads\\images\\")) {
//       pathsOfAllFilesToBeDeleted.push(obj[key]);
//     }

//     if (typeof obj[key] === "object" && obj[key] !== null) {
//       extractPathsOfAllFilesToBeDeleted(obj[key]);
//     }
//   });
// }

function getAllImagesIDis(project) {
  const allImagesPathInCloudinary =
    extractPathsOfAllExternalFilesInCloudinary(project);
  return extractIDisFromPath(allImagesPathInCloudinary);
}

function extractIDisFromPath(fullPathsArray) {
  const resultArray = fullPathsArray.map((path) => {
    let result = "";
    result = path.match(/ante_portfolio_images\/.+\.([A-Za-z]){3}$/i)[0];
    result = result.split(".")[0];
    return result;
  });

  return resultArray;
}
async function checkAllImagesIfTheyExist(imagesIDisArray) {
  return new Promise(async (resolve, reject) => {
    let finalResult = true;
    for (let i = 0; i < imagesIDisArray.length; i++) {
      try {
        await cloudinary.uploader.explicit(
          imagesIDisArray[i],
          { type: "upload" },
          (error, result) => {
            if (error) finalResult = false;
            // console.log("result w środku for'a", result);
          }
        );
      } catch (error) {
        console.log(error);
      }
    }

    if (finalResult) resolve(true);
    if (!finalResult) reject(false);
  });
}

function extractPathsOfAllExternalFilesInCloudinary(project) {
  const resultArray = [];
  resultArray.push(project.icoImgFull);

  if (project.genre === genre.PANORAMA) {
    project.panoramas.forEach((panorama) => {
      resultArray.push(panorama.panoramaIcoFull);
      resultArray.push(panorama.panoramaImageSourceFull);
    });
  }

  if (project.genre === genre.GRAPHIC) {
    project.images.forEach((image) => {
      resultArray.push(image.imageSourceFull);
    });
  }

  if (project.genre === genre.ANIMATION) {
  }

  if (project.genre === genre.APP) {
    resultArray.push(project.appInfo.appImageFull);
  }

  return resultArray;
}

function createGoodPathToExtractValueFromObject(formFieldName) {
  const foundMatch = formFieldName.match(/(\[[A-Za-z0-9]+\]$)/);

  if (!foundMatch) return formFieldName;

  const foundAreaToBeChanged = foundMatch[0];
  const unchangeablePathOfPath = formFieldName.replace(
    foundAreaToBeChanged,
    ""
  );

  return `${unchangeablePathOfPath}${foundAreaToBeChanged.substring(
    0,
    1
  )}"${foundAreaToBeChanged.substring(1, foundAreaToBeChanged.length - 1)}"]`;
}

function getRidOfDuplicates(arrayOfImagesToBeDeleted) {
  return [...new Set(arrayOfImagesToBeDeleted)];
}

exports.getProjects = getProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.updateProjectById = updateProjectById;
exports.deleteProjectById = deleteProjectById;
exports.extractIDisFromPath = extractIDisFromPath;
exports.checkAllImagesIfTheyExist = checkAllImagesIfTheyExist;
exports.getRidOfDuplicates = getRidOfDuplicates;
