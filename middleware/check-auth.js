const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

//config
// const currentConfig = require("../shared/currentConfig");
// const config = require("../oldFiles/config")[currentConfig];

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      throw new Error("Authentication failed");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.useData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return next(
      new HttpError(
        "Authentication failed, you don't have access to that routes without valid token.",
        403
      )
    );
  }
};
