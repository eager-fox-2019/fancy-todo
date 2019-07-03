require("dotenv").config();
const express = require("express");
const routes = require("./Routes/Index.js");
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const ErrorHandler = require('./helpers/Error-Handler.js');

let local = 'mongodb://localhost/Fancy-Todo'
let uri = 'mongodb+srv://admin:admin@cluster0-ezblw.gcp.mongodb.net/fancy-todo?retryWrites=true&w=majority'
mongoose.connect(uri , {useNewUrlParser: true});

app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/", routes);
app.use(ErrorHandler)

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`connected to localhost ${PORT}`);
});