const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const utils = require("./shared/utils");
const cors = require("cors");
//env
// const currentConfig = require("./shared/currentConfig");
// const config = require("./config")[currentConfig];
//
const projectRoutes = require("./routes/projects-routes");
const loginRoutes = require("./routes/login-routes");
const contactRoutes = require("./routes/contact-routes");

const PORT = process.env.PORT || 5000;

////express
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images"))
);
app.use("/api/projects", projectRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/contact", contactRoutes);

//errors
app.use((req, res, next) => {
  return next(new HttpError("Could not find this route.", 404));
});

app.use((error, req, res, next) => {
  // if (req.files) {
  //   console.log("deleting file");
  //   req.files.forEach((file) => {
  //     //delete of main image
  //     fs.unlink(file.path, (err) => {
  //       console.log(err);
  //     });

  //     //delete of thumbnail image
  //     const thumbnailPath = utils.createPathOfThumbnailBasedOnFilePath(
  //       file.path
  //     );
  //     if (fs.existsSync(thumbnailPath)) {
  //       fs.unlink(thumbnailPath, (err) => {
  //         console.log(err);
  //       });
  //     }
  //   });
  // }

  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred." });
});

//db & listener
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.c9ept.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});

////working normally
// mongoose
//   .connect(
//     `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.c9ept.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
//   )
//   .then(() => {
//     app.listen(process.env.PORT || 5000);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
