const express = require("express");
const bodyParser = require("body-parser");
//
const projectRoutes = require("./routes/projects-routes");

////express
const app = express();

app.use("/api/projects", projectRoutes);

////listener
app.listen(5000);
