require('dotenv').config();

const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const routes = require('./routes');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Fancy-Todo', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Database Fancy-Todo connected');
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

app.use('/', routes);

app.get('/', (req, res, next) => {
  res.status(200).json('HELLO WORLD');
})

app.use(function (err, req, res, next) {

  console.log(err);

  if (err.code === 404) {
    res.status(404).json({
      message: 'Resource not found',
      code: 404
    });
  } else if (err.code === 401) {
    res.status(401).json({
      message: 'Do not have access',
      code: 401
    });
  } else if (err.code === 400) {
    res.status(400).json({
      message: 'Invalid access token',
      code: 400
    });
  } else if (err.name == 'ValidationError') {
    res.status(422).json(err);
  } else {
    res.status(500).json(err);
  }
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
})