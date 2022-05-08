const projectControler = require("../project-controller");

describe("project-controller", () => {
  it("should extract only IDs into array from whole paths array", () => {
    const inputArray = [
      "https://res.cloudinary.com/dn8l30dkf/image/upload/v1651560269/ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_pjblrk.jpg",
      "https://res.cloudinary.com/dn8l30dkf/image/upload/v1651560270/ante_portfolio_images/2019_08_obiekt_biurowy_leverkusen_niemcy_ico_gc9nsy.jpg",
      "https://res.cloudinary.com/dn8l30dkf/image/upload/v1651560270/ante_portfolio_images/2020_07_osiedle_mieszkaniowe_aachen_niemcy_ico_egyidp.jpg",
      "https://res.cloudinary.com/dn8l30dkf/image/upload/v1651560270/ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_hpkmvc.jpg",
      "https://res.cloudinary.com/dn8l30dkf/image/upload/v1651561255/ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_s2yqle.jpg",
    ];

    const result = projectControler.extractIDisFromPath(inputArray); //?
    expect(result).toEqual([
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_pjblrk",
      "ante_portfolio_images/2019_08_obiekt_biurowy_leverkusen_niemcy_ico_gc9nsy",
      "ante_portfolio_images/2020_07_osiedle_mieszkaniowe_aachen_niemcy_ico_egyidp",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_hpkmvc",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_s2yqle",
    ]);
  });

  it("should check if all files exist in cloudinary", () => {
    const inputArray = [
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_pjblrk",
      "ante_portfolio_images/2019_08_obiekt_biurowy_leverkusen_niemcy_ico_gc9nsy",
      "ante_portfolio_images/2020_07_osiedle_mieszkaniowe_aachen_niemcy_ico_egyidp",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_hpkmvc",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_s2yqle",
    ];

    projectControler.checkAllImagesIfTheyExist(inputArray);
  });

  it("should get rid of duplicates in passed array", () => {
    const inputArray = [
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_qnpzrt",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_qnpzrt",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_qnpzrt",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_qnpzrt",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_qnpzrt",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_ytrzrt",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_ytrzrt",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_ytrzrt",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_ytrzrt",
    ];

    const result = projectControler.getRidOfDuplicates(inputArray);
    expect(result).toEqual([
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_qnpzrt",
      "ante_portfolio_images/2013_08_osiedle_mieszkaniowe_dusseldorf_niemcy_ico01_ytrzrt",
    ]);
  });

  it("should not hang if passed array is empty", () => {
    const inputArray = [];
    const result = projectControler.getRidOfDuplicates(inputArray);
    expect(result).toEqual([]);
  });
  it("should not hang if passed array is null", () => {
    const inputArray = null;
    const result = projectControler.getRidOfDuplicates(inputArray);
    expect(result).toEqual([]);
  });
});
