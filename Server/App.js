require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const ErrorHandler = require('./helpers/Error-Handler.js');
const path = require('path');

mongoose.connect('mongodb://localhost/Fancy-Todo', {useNewUrlParser: true});

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/", routes);
app.use(ErrorHandler)

const PORT = 3000;
app.listen(PORT, ()=> {
    console.log(`connected to localhost ${PORT}`);
});