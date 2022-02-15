const HttpError = require("../models/http-error");

//dummies
const DUMMY_USERS = [
  {
    id: "u1",
    login: "login",
    password: "password",
  },
  {
    id: "u2",
    login: "login2",
    password: "password2",
  },
];

////logic
const login = (req, res, next) => {
  const { login, password } = req.body;

  const userFound = DUMMY_USERS.find((user) => user.login === login);
  if (!userFound) {
    return next(
      new HttpError("Wrong login, there's no user with login provided.", 401)
    );
  }

  if (userFound.password !== password) {
    return next(new HttpError("Wrong password.", 401));
  }

  res.json({ message: "logged in!" });
};

exports.login = login;
