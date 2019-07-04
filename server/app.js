require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const morgan = require("morgan");
const mongoose = require("mongoose");

const routes = require("./routes/index");
const errHandler = require("./helpers/errHandler");

const cors = require("cors");
app.use(cors());

app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: false }));

app.use("/", routes);
app.use(errHandler);

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(connected => {
    console.log("db connected", process.env.MONGODB_URL);
  })
  .catch(errors => {
    console.log(JSON.stringify(errors, null, 2));
  });

if (process.env.NODE_ENV === "testing") {
  module.exports = app;
} else {
  app.listen(port, () => {
    console.log("listen", port);
  });
}
