function createPathOfThumbnailBasedOnFilePath(filePath) {
  return `${filePath.split(".")[0]}__thumbnail.jpeg`;
}

module.exports.createPathOfThumbnailBasedOnFilePath =
  createPathOfThumbnailBasedOnFilePath;
