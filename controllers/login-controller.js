const HttpError = require("../models/http-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//config
// const currentConfig = require("../shared/currentConfig");
// const config = require("../oldFiles/config")[currentConfig];

const login = async (req, res, next) => {
  const { login, password } = req.body;

  //encrypted password generation - start
  // const desiredPassword = "ala";
  // let hashedPassword;
  // try {
  //   hashedPassword = await bcrypt.hash(desiredPassword, 12);
  // } catch (error) {
  //   return next(new HttpError("Could not create user, please try again", 500));
  // }
  // console.log(hashedPassword);
  // encrypted password generation - end

  let existingUser;
  try {
    existingUser = await User.findOne({ login: login });
  } catch (err) {
    return next(
      new HttpError(
        `Logging in failed, please try again. Details: (${err.message})`,
        500
      )
    );
  }

  if (!existingUser) {
    return next(
      new HttpError("Wrong login, there's no user with login provided.", 403)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in, please check your credentials and try again.",
        403
      )
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("Wrong password.", 403));
  }

  let token;
  try {
    token = jwt.sign(
      { login: existingUser.login, id: existingUser.id },
      process.env.JWT_KEY,
      {
        expiresIn: "8h",
      }
    );
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in, please check your credentials and try again.",
        403
      )
    );
  }

  res.json({
    userId: existingUser.id,
    login: existingUser.login,
    token: token,
  });
};

exports.login = login;
