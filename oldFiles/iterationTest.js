const testObject = {
  _id: { $oid: "623c96cb8c33557fab35fee3" },
  panoramas: [
    {
      panoramaTitlePl: "pano 1",
      panoramaTitleEn: "pano one",
      panoramaIcoFull:
        "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_1648137930713.jpeg",
      panoramaIcoThumb:
        "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_1648137930713__thumbnail.jpeg",
      panoramaImageSourceFull:
        "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_pano02big_1648137930717.jpeg",
      panoramaImageSourceFullThumb:
        "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_pano02big_1648137930717__thumbnail.jpeg",
      _id: { $oid: "623c96cb8c33557fab35fee4" },
    },
    {
      panoramaTitlePl: "pano 2",
      panoramaTitleEn: "pano two",
      panoramaIcoFull:
        "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_1648137930758.jpeg",
      panoramaIcoThumb:
        "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_1648137930758__thumbnail.jpeg",
      panoramaImageSourceFull:
        "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_pano02big_1648137930759.jpeg",
      panoramaImageSourceFullThumb:
        "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_pano02big_1648137930759__thumbnail.jpeg",
      _id: { $oid: "623c96cb8c33557fab35fee5" },
    },
  ],
  genre: "PANORAMA",
  projNamePl: "fgb",
  projNameEn: "dfgb",
  completionDate: { $date: { $numberLong: "1286668800000" } },
  cityPl: "dfgb",
  cityEn: "dfgb",
  clientPl: "dfgb",
  clientEn: "dfgb",
  countryPl: "dfgb",
  countryEn: "dfgb",
  icoImgFull:
    "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_1648137930710.jpeg",
  icoImgThumb:
    "uploads\\images\\2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_1648137930710__thumbnail.jpeg",
  projectType: ["COMPETITION", "ANIMATION", "EXTERIOR"],
  projectGenre: "ProjectPanorama",
  __v: { $numberInt: "0" },
};

const pathsOfAllFilesToBeDeleted = [];
extractPathsOfAllFilesToBeDeleted(testObject);

function extractPathsOfAllFilesToBeDeleted(obj) {
  Object.keys(obj).forEach((key) => {
    const isString =
      Object.prototype.toString.call(obj[key]) === "[object String]";

    if (isString && obj[key].startsWith("uploads\\images\\")) {
      pathsOfAllFilesToBeDeleted.push(obj[key]);
    }

    if (typeof obj[key] === "object" && obj[key] !== null) {
      extractPathsOfAllFilesToBeDeleted(obj[key]);
    }
  });
}

console.log(pathsOfAllFilesToBeDeleted);
