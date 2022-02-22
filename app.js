const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
//env
const env = "development";
const config = require("./config")[env];
//
const projectRoutes = require("./routes/projects-routes");
const loginRoutes = require("./routes/login-routes");

////express
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

//routes
app.use("/api/projects", projectRoutes);
app.use("/api/login", loginRoutes);

//errors
app.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured." });
});

//db & listener
mongoose
  .connect(config.database.url)
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
