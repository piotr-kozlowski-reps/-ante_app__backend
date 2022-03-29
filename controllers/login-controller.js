const HttpError = require("../models/http-error");
const User = require("../models/user");
// const bcrypt = require("bcryptjs");

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

  if (existingUser.password !== password) {
    return next(new HttpError("Wrong password.", 401));
  }

  res.json({ message: "logged in!" });
};

exports.login = login;
