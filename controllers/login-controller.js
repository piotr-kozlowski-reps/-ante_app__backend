const HttpError = require("../models/http-error");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const currentConfig = require("../shared/currentConfig");
const config = require("../config")[currentConfig];

const login = async (req, res, next) => {
  const { login, password } = req.body;

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
      new HttpError("Wrong login, there's no user with login provided.", 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in, please check your credentials and try again.",
        401
      )
    );
  }

  if (!isValidPassword) {
    return next(new HttpError("Wrong password.", 401));
  }

  //encrypted password generation - start
  // let hashedPassword;
  // try {
  //   hashedPassword = await bcrypt.hash(password, 12);
  // } catch (error) {
  //   return next(new HttpError("Could not create user, please try again", 500));
  // }
  //encrypted password generation - end

  let token;
  try {
    token = jwt.sign(
      { login: existingUser.login, id: existingUser.id },
      config.key,
      {
        expiresIn: "1h",
      }
    );
  } catch (error) {
    return next(
      new HttpError(
        "Could not log you in, please check your credentials and try again.",
        401
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
