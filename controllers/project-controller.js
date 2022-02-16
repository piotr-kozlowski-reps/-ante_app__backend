const { v4: uuidv4 } = require("uuid");
const type = require("../shared/type");
const genre = require("../shared/genre");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

//DUMMIES
const ico1 =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2019_07_wnetrze_mieszkalne_essen_niemcy_ico.jpg?raw=true";
const ico1Thumb =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2019_07_wnetrze_mieszkalne_essen_niemcy_ico__thumb.jpg?raw=true";
const ico2 =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2019_08_obiekt_biurowy_leverkusen_niemcy_ico.jpg?raw=true";
const ico2Thumb =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2019_08_obiekt_biurowy_leverkusen_niemcy_ico__thumb.jpg?raw=true";
const ico3 =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2020_05_osiedle_mieszkaniowe_dormagen_niemcy_ico.jpg?raw=true";
const ico3Thumb =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2020_05_osiedle_mieszkaniowe_dormagen_niemcy_ico__thumb.jpg?raw=true";
const ico4 =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2020_07_osiedle_mieszkaniowe_aachen_niemcy_ico.jpg?raw=true";
const ico4Thumb =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2020_07_osiedle_mieszkaniowe_aachen_niemcy_ico__thumb.jpg?raw=true";

const image1big =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2009_02_centrum_hotelowo_kongresowe_wroclaw_polska_001.jpg?raw=true";
const image1bigThumb =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2009_02_centrum_hotelowo_kongresowe_wroclaw_polska_001__thumb.jpg?raw=true";
const image2 =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2009_02_centrum_hotelowo_kongresowe_wroclaw_polska_002.jpg?raw=true";
const image2Thumb =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2009_02_centrum_hotelowo_kongresowe_wroclaw_polska_002__thumb.jpg?raw=true";
const phoneImage =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/phone_melbeck.png?raw=true";
const phoneImageThumb =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/phone_melbeck__thumb.jpg?raw=true";
const panoramaIco =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01.jpg?raw=true";
const panoramaIcoThumb =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01__thumb.jpg?raw=true";
const panoramaFull =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_pano02big.jpg?raw=true";
const panoramaFullThumb =
  "https://github.com/piotr-kozlowski-reps/ante_app__react/blob/master/src/images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_pano02big__thumb.jpg?raw=true";

let DUMMY_PROJECTS = [
  {
    id: "1",
    genre: genre.PANORAMA,
    projNamePl: "projNamePl1",
    projNameEn: "projNameEn1",
    completionDate: new Date("2013-11"),
    cityPl: "cityPL1",
    cityEn: "cityEn1",
    countryPl: "countryPL1",
    countryEn: "countryEn1",
    icoImgFull: ico1,
    icoImgThumb: ico1Thumb,
    type: [type.COMPETITION],
    panoramas: [
      {
        panoramaTitlePl: "PANORAMA_1",
        panoramaTitleEn: "PANORAMA_1",
        panoramaIcoFull: panoramaIco,
        panoramaIcoThumb: panoramaIcoThumb,
        panoramaImageSourceFull: panoramaFull,
        panoramaImageSourceFullThumb: panoramaFullThumb,
      },
      {
        panoramaTitlePl: "PANORAMA_2",
        panoramaTitleEn: "PANORAMA_2",
        panoramaIcoFull: panoramaIco,
        panoramaIcoThumb: panoramaIcoThumb,
        panoramaImageSourceFull: panoramaFull,
        panoramaImageSourceFullThumb: panoramaFullThumb,
      },
      {
        panoramaTitlePl: "PANORAMA_3",
        panoramaTitleEn: "PANORAMA_3",
        panoramaIcoFull: panoramaIco,
        panoramaIcoThumb: panoramaIcoThumb,
        panoramaImageSourceFull: panoramaFull,
        panoramaImageSourceFullThumb: panoramaFullThumb,
      },
    ],
  },
  {
    id: "2",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl2",
    projNameEn: "projNameEn2",
    completionDate: new Date("2018-11"),
    cityPl: "cityPL2",
    cityEn: "cityEn2",
    countryPl: "countryPL2",
    countryEn: "countryEn2",
    icoImgFull: ico2,
    icoImgThumb: ico2Thumb,
    type: [type.COMPETITION, type.INTERIOR],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "3",
    genre: genre.PANORAMA,
    projNamePl: "projNamePl3",
    projNameEn: "projNameEn3",
    completionDate: new Date("2020-11"),
    cityPl: "cityPL3",
    cityEn: "cityEn3",
    countryPl: "countryPL3",
    countryEn: "countryEn3",
    icoImgFull: ico3,
    icoImgThumb: ico3Thumb,
    type: [type.PANORAMA, type.INTERIOR, type.EXTERIOR],
    panoramas: [
      {
        panoramaTitlePl: "PANORAMA_1",
        panoramaTitleEn: "PANORAMA_1",
        panoramaIcoFull: panoramaIco,
        panoramaIcoThumb: panoramaIcoThumb,
        panoramaImageSourceFull: panoramaFull,
        panoramaImageSourceFullThumb: panoramaFullThumb,
      },
      {
        panoramaTitlePl: "PANORAMA_2",
        panoramaTitleEn: "PANORAMA_2",
        panoramaIcoFull: panoramaIco,
        panoramaIcoThumb: panoramaIcoThumb,
        panoramaImageSourceFull: panoramaFull,
        panoramaImageSourceFullThumb: panoramaFullThumb,
      },
      {
        panoramaTitlePl: "PANORAMA_3",
        panoramaTitleEn: "PANORAMA_3",
        panoramaIcoFull: panoramaIco,
        panoramaIcoThumb: panoramaIcoThumb,
        panoramaImageSourceFull: panoramaFull,
        panoramaImageSourceFullThumb: panoramaFullThumb,
      },
    ],
  },
  {
    id: "4",
    genre: genre.ANIMATION,
    projNamePl: "projNamePl4",
    projNameEn: "projNameEn4",
    completionDate: new Date("2021-4"),
    cityPl: "cityPL4",
    cityEn: "cityEn4",
    countryPl: "countryPL4",
    countryEn: "countryEn4",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [type.COMPETITION, type.INTERIOR, type.EXTERIOR, type.ANIMATION],
    videoSource: "https://www.youtube.com/embed/ljUUT4BJ_7M",
    videoSourceThumb: image1bigThumb,
  },
  {
    id: "5",
    genre: genre.APP,
    projNamePl: "projNamePl5",
    projNameEn: "projNameEn5",
    completionDate: new Date("2014-4"),
    cityPl: "cityPL5",
    cityEn: "cityEn5",
    countryPl: "countryPL5",
    countryEn: "countryEn5",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
    ],
    appInfo: {
      appNamePl: "VILLA MELBECK",
      appNameEn: "VILLA MELBECK",
      appImageFull: phoneImage,
      appImageThumb: phoneImageThumb,
      appDescriptionPl:
        "Aplikacja mobilna VILLA MELBECK to prezentacja modelu 3d za pomocą technologii Augmented Reality. Gdy skierują Państwo kamerę swojego telefonu na wydrukowany wcześniej plan zagospodarowania terenu (zawarty w aplikacji w formie PDF'a), pojawi się na ekranie model trójwymiarowy budynku.",
      appDescriptionEn:
        "Mobile application VILLA MELBECK is a presentation of 3d model with Augmented Reality technology. When you point your mobile phone camera at printed land development plan (available within the application in PDF format), you will see 3dimensional model of provided building.",
      appAndroidLink:
        "https://play.google.com/store/apps/details?id=com.vf.dus160",
      appIOSLink: "https://itunes.apple.com/us/app/xantenerstr-12/id1456387858",
    },
  },
  {
    id: "6",
    genre: genre.APP,
    projNamePl: "projNamePl7",
    projNameEn: "projNameEn7",
    completionDate: new Date("2012-4"),
    cityPl: "cityPL7",
    cityEn: "cityEn7",
    countryPl: "countryPL7",
    countryEn: "countryEn7",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
      type.PANORAMA,
    ],
    appInfo: {
      appNamePl: "VILLA MELBECK",
      appNameEn: "VILLA MELBECK",
      appImageFull: phoneImage,
      appImageThumb: phoneImageThumb,
      appDescriptionPl:
        "Aplikacja mobilna VILLA MELBECK to prezentacja modelu 3d za pomocą technologii Augmented Reality. Gdy skierują Państwo kamerę swojego telefonu na wydrukowany wcześniej plan zagospodarowania terenu (zawarty w aplikacji w formie PDF'a), pojawi się na ekranie model trójwymiarowy budynku.",
      appDescriptionEn:
        "Mobile application VILLA MELBECK is a presentation of 3d model with Augmented Reality technology. When you point your mobile phone camera at printed land development plan (available within the application in PDF format), you will see 3dimensional model of provided building.",
      appAndroidLink:
        "https://play.google.com/store/apps/details?id=com.vf.dus160",
      appIOSLink: "https://itunes.apple.com/us/app/xantenerstr-12/id1456387858",
    },
  },
  {
    id: "7",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl6",
    projNameEn: "projNameEn6",
    completionDate: new Date("2012-4"),
    cityPl: "cityPL6",
    cityEn: "cityEn6",
    countryPl: "countryPL6",
    countryEn: "countryEn6",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
      type.PANORAMA,
      type.APP,
    ],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "8",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl8",
    projNameEn: "projNameEn8",
    completionDate: new Date("2013-11"),
    cityPl: "cityPL8",
    cityEn: "cityEn8",
    countryPl: "countryPL8",
    countryEn: "countryEn8",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [type.COMPETITION],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "9",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl9",
    projNameEn: "projNameEn9",
    completionDate: new Date("2018-11"),
    cityPl: "cityPL9",
    cityEn: "cityEn9",
    countryPl: "countryPL9",
    countryEn: "countryEn9",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [type.COMPETITION, type.INTERIOR],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "10",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl10",
    projNameEn: "projNameEn10",
    completionDate: new Date("2020-11"),
    cityPl: "cityPL10",
    cityEn: "cityEn10",
    countryPl: "countryPL10",
    countryEn: "countryEn10",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [type.COMPETITION, type.INTERIOR, type.EXTERIOR],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "11",
    genre: genre.ANIMATION,
    projNamePl: "projNamePl11",
    projNameEn: "projNameEn11",
    completionDate: new Date("2021-4"),
    cityPl: "cityPL11",
    cityEn: "cityEn11",
    countryPl: "countryPL11",
    countryEn: "countryEn11",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [type.COMPETITION, type.INTERIOR, type.EXTERIOR, type.ANIMATION],
    videoSource: "https://www.youtube.com/embed/ljUUT4BJ_7M",
    videoSourceThumb: image1bigThumb,
  },
  {
    id: "12",
    genre: genre.APP,
    projNamePl: "projNamePl12",
    projNameEn: "projNameEn12",
    completionDate: new Date("2014-4"),
    cityPl: "cityPL12",
    cityEn: "cityEn12",
    countryPl: "countryPL12",
    countryEn: "countryEn12",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
    ],
    appInfo: {
      appNamePl: "VILLA MELBECK",
      appNameEn: "VILLA MELBECK",
      appImageFull: phoneImage,
      appImageThumb: phoneImageThumb,
      appDescriptionPl:
        "Aplikacja mobilna VILLA MELBECK to prezentacja modelu 3d za pomocą technologii Augmented Reality. Gdy skierują Państwo kamerę swojego telefonu na wydrukowany wcześniej plan zagospodarowania terenu (zawarty w aplikacji w formie PDF'a), pojawi się na ekranie model trójwymiarowy budynku.",
      appDescriptionEn:
        "Mobile application VILLA MELBECK is a presentation of 3d model with Augmented Reality technology. When you point your mobile phone camera at printed land development plan (available within the application in PDF format), you will see 3dimensional model of provided building.",
      appAndroidLink:
        "https://play.google.com/store/apps/details?id=com.vf.dus160",
      appIOSLink: "https://itunes.apple.com/us/app/xantenerstr-12/id1456387858",
    },
  },
  {
    id: "13",
    genre: genre.ANIMATION,
    projNamePl: "projNamePl13",
    projNameEn: "projNameEn13",
    completionDate: new Date("2012-4"),
    cityPl: "cityPL13",
    cityEn: "cityEn13",
    countryPl: "countryPL13",
    countryEn: "countryEn13",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
      type.PANORAMA,
    ],
    videoSource: "https://www.youtube.com/embed/ljUUT4BJ_7M",
    videoSourceThumb: image1bigThumb,
  },
  {
    id: "14",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl14",
    projNameEn: "projNameEn14",
    completionDate: new Date("2012-4"),
    cityPl: "cityPL14",
    cityEn: "cityEn14",
    countryPl: "countryPL14",
    countryEn: "countryEn14",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
      type.PANORAMA,
      type.APP,
    ],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "15",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl15",
    projNameEn: "projNameEn15",
    completionDate: new Date("2012-4"),
    cityPl: "cityPL15",
    cityEn: "cityEn15",
    countryPl: "countryPL15",
    countryEn: "countryEn15",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
      type.PANORAMA,
      type.APP,
    ],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "16",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl16",
    projNameEn: "projNameEn16",
    completionDate: new Date("2013-11"),
    cityPl: "cityPL16",
    cityEn: "cityEn16",
    countryPl: "countryPL16",
    countryEn: "countryEn16",
    icoImgFull: ico1,
    icoImgThumb: ico1Thumb,
    type: [type.COMPETITION],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "17",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl17",
    projNameEn: "projNameEn17",
    completionDate: new Date("2018-11"),
    cityPl: "cityPL17",
    cityEn: "cityEn17",
    countryPl: "countryPL17",
    countryEn: "countryEn17",
    icoImgFull: ico2,
    icoImgThumb: ico2Thumb,
    type: [type.COMPETITION, type.INTERIOR],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "18",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl18",
    projNameEn: "projNameEn18",
    completionDate: new Date("2020-11"),
    cityPl: "cityPL18",
    cityEn: "cityEn18",
    countryPl: "countryPL18",
    countryEn: "countryEn18",
    icoImgFull: ico3,
    icoImgThumb: ico3Thumb,
    type: [type.COMPETITION, type.INTERIOR, type.EXTERIOR],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
  {
    id: "19",
    genre: genre.APP,
    projNamePl: "projNamePl19",
    projNameEn: "projNameEn19",
    completionDate: new Date("2021-4"),
    cityPl: "cityPL19",
    cityEn: "cityEn19",
    countryPl: "countryPL19",
    countryEn: "countryEn19",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [type.COMPETITION, type.INTERIOR, type.EXTERIOR, type.ANIMATION],
    appInfo: {
      appNamePl: "VILLA MELBECK",
      appNameEn: "VILLA MELBECK",
      appImageFull: phoneImage,
      appImageThumb: phoneImageThumb,
      appDescriptionPl:
        "Aplikacja mobilna VILLA MELBECK to prezentacja modelu 3d za pomocą technologii Augmented Reality. Gdy skierują Państwo kamerę swojego telefonu na wydrukowany wcześniej plan zagospodarowania terenu (zawarty w aplikacji w formie PDF'a), pojawi się na ekranie model trójwymiarowy budynku.",
      appDescriptionEn:
        "Mobile application VILLA MELBECK is a presentation of 3d model with Augmented Reality technology. When you point your mobile phone camera at printed land development plan (available within the application in PDF format), you will see 3dimensional model of provided building.",
      appAndroidLink:
        "https://play.google.com/store/apps/details?id=com.vf.dus160",
      appIOSLink: "https://itunes.apple.com/us/app/xantenerstr-12/id1456387858",
    },
  },
  {
    id: "20",
    genre: genre.APP,
    projNamePl: "projNamePl20",
    projNameEn: "projNameEn20",
    completionDate: new Date("2014-4"),
    cityPl: "cityPL20",
    cityEn: "cityEn20",
    countryPl: "countryPL20",
    countryEn: "countryEn20",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
    ],
    appInfo: {
      appNamePl: "VILLA MELBECK",
      appNameEn: "VILLA MELBECK",
      appImageFull: phoneImage,
      appImageThumb: phoneImageThumb,
      appDescriptionPl:
        "Aplikacja mobilna VILLA MELBECK to prezentacja modelu 3d za pomocą technologii Augmented Reality. Gdy skierują Państwo kamerę swojego telefonu na wydrukowany wcześniej plan zagospodarowania terenu (zawarty w aplikacji w formie PDF'a), pojawi się na ekranie model trójwymiarowy budynku.",
      appDescriptionEn:
        "Mobile application VILLA MELBECK is a presentation of 3d model with Augmented Reality technology. When you point your mobile phone camera at printed land development plan (available within the application in PDF format), you will see 3dimensional model of provided building.",
      appAndroidLink:
        "https://play.google.com/store/apps/details?id=com.vf.dus160",
      appIOSLink: "https://itunes.apple.com/us/app/xantenerstr-12/id1456387858",
    },
  },
  {
    id: "21",
    genre: genre.APP,
    projNamePl: "projNamePl21",
    projNameEn: "projNameEn21",
    completionDate: new Date("2012-4"),
    cityPl: "cityPL21",
    cityEn: "cityEn21",
    countryPl: "countryPL21",
    countryEn: "countryEn21",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
      type.PANORAMA,
    ],
    appInfo: {
      appNamePl: "VILLA MELBECK",
      appNameEn: "VILLA MELBECK",
      appImageFull: phoneImage,
      appImageThumb: phoneImageThumb,
      appDescriptionPl:
        "Aplikacja mobilna VILLA MELBECK to prezentacja modelu 3d za pomocą technologii Augmented Reality. Gdy skierują Państwo kamerę swojego telefonu na wydrukowany wcześniej plan zagospodarowania terenu (zawarty w aplikacji w formie PDF'a), pojawi się na ekranie model trójwymiarowy budynku.",
      appDescriptionEn:
        "Mobile application VILLA MELBECK is a presentation of 3d model with Augmented Reality technology. When you point your mobile phone camera at printed land development plan (available within the application in PDF format), you will see 3dimensional model of provided building.",
      appAndroidLink:
        "https://play.google.com/store/apps/details?id=com.vf.dus160",
      appIOSLink: "https://itunes.apple.com/us/app/xantenerstr-12/id1456387858",
    },
  },
  {
    id: "22",
    genre: genre.GRAPHIC,
    projNamePl: "projNamePl22",
    projNameEn: "projNameEn22",
    completionDate: new Date("2012-4"),
    cityPl: "cityPL22",
    cityEn: "cityEn22",
    countryPl: "countryPL22",
    countryEn: "countryEn22",
    icoImgFull: ico4,
    icoImgThumb: ico4Thumb,
    type: [
      type.COMPETITION,
      type.INTERIOR,
      type.EXTERIOR,
      type.ANIMATION,
      type.PRODUCT_MODELING,
      type.PANORAMA,
      type.APP,
    ],
    images: [
      {
        imageSourceFull: image1big,
        imageSourceThumb: image1bigThumb,
        imageAltPl: "Hall hotelu.",
        imageAltEn: "Lounge of the hotel.",
        isBig: true,
      },
      {
        imageSourceFull: image2,
        imageSourceThumb: image2Thumb,
        imageAltPl: "Przekrój.",
        imageAltEn: "Cross-section.",
        isBig: false,
      },
    ],
  },
];

////logic
const getProjects = (req, res, next) => {
  const projectsListMapped = DUMMY_PROJECTS.map((project) => {
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
      type: project.type,
    };
  });

  res.json({ projects: projectsListMapped });
};

const getProjectById = (req, res, next) => {
  const projectId = req.params.projectId;
  const project = DUMMY_PROJECTS.find((project) => project.id === projectId);

  if (!project) {
    return next(
      new HttpError("Could not find the project for the provided id.", 404)
    );
  }
  res.json({ project });
};

const createProject = (req, res, next) => {
  //validating errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errrorsMessages = errors.errors.map((error) => {
      return {
        errorField: error.param,
        errorMessage: error.msg,
      };
    });

    return res.status(422).json(errrorsMessages);
  }

  //creating logic
  const projectGenre = req.body.genre;

  const newProject = createNewProjectFromBodyData(req, projectGenre, false);

  if (!newProject) {
    return next(
      new HttpError("Could not create project with provided genre", 400)
    );
  }

  DUMMY_PROJECTS.push(newProject);

  res.status(201).json({ project: newProject });
};

const updateProjectById = (req, res, next) => {
  //validating errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errrorsMessages = errors.errors.map((error) => {
      return {
        errorField: error.param,
        errorMessage: error.msg,
      };
    });

    return res.status(422).json(errrorsMessages);
  }

  //updating logic
  const projectGenre = req.body.genre;
  const projectId = req.params.projectId;

  let existingProject = {
    ...DUMMY_PROJECTS.find((project) => project.id === projectId),
  };
  const projectIndex = DUMMY_PROJECTS.findIndex(
    (project) => project.id === projectId
  );

  if (!existingProject || Object.keys(existingProject).length === 0) {
    return next(new HttpError("Could not find project with provided id.", 400));
  }

  const newProject = createNewProjectFromBodyData(req, projectGenre, true);

  if (!newProject) {
    return next(
      new HttpError("Could not update project with provided genre.", 400)
    );
  }

  if (existingProject.genre !== newProject.genre) {
    return next(
      new HttpError(
        "Could not update project, provided project's genre is different than existing one.",
        400
      )
    );
  }

  newProject.id = projectId;
  DUMMY_PROJECTS[projectIndex] = newProject;

  res.status(201).json({ project: newProject });
};

const deleteProjectById = (req, res, next) => {
  const projectId = req.params.projectId;

  const existingProject = {
    ...DUMMY_PROJECTS.find((project) => project.id === projectId),
  };
  if (!existingProject || Object.keys(existingProject).length === 0) {
    return next(new HttpError("Could not find project with provided id.", 400));
  }

  DUMMY_PROJECTS = DUMMY_PROJECTS.filter((project) => project.id !== projectId);

  res.status(200).json({ message: "Project deleted." });
};

//utils
function createNewProjectFromBodyData(req, projectGenre, isUpdate) {
  const {
    genre,
    projNamePl,
    projNameEn,
    completionDate,
    cityPl,
    cityEn,
    countryPl,
    countryEn,
    icoImgFull,
    icoImgThumb,
    type,
  } = req.body;

  const newProject = {
    id: isUpdate ? req.body.id : uuidv4(),
    genre,
    projNamePl,
    projNameEn,
    completionDate,
    cityPl,
    cityEn,
    countryPl,
    countryEn,
    icoImgFull,
    icoImgThumb,
    type,
  };

  switch (projectGenre) {
    case "GRAPHIC":
      const { images } = req.body;
      newProject.images = images;
      break;

    case "ANIMATION":
      const { videoSource, videoSourceThumb } = req.body;
      newProject.videoSource = videoSource;
      newProject.videoSourceThumb = videoSourceThumb;
      break;

    case "APP":
      const { appInfo } = req.body;
      newProject.appInfo = appInfo;
      break;

    case "PANORAMA":
      const { panoramas } = req.body;
      newProject.panoramas = panoramas;
      break;

    default:
      return null;
  }

  return newProject;
}

exports.getProjects = getProjects;
exports.getProjectById = getProjectById;
exports.createProject = createProject;
exports.updateProjectById = updateProjectById;
exports.deleteProjectById = deleteProjectById;
