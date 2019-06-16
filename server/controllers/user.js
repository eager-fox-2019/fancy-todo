const Model = require('../models');
const {
  verifyPassword,
  generateToken
} = require('../helpers');

class User {

  static register(req, res, next) {
    let userObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    }

    Model.User.create(userObj)
      .then((response) => {
        res.status(201).json(response);
      })
      .catch((err) => {
        next(err);
      })
  }

  static login(req, res, next) {
    let email = req.body.email;
    let password = req.body.password;

    Model.User.find({
        email
      })
      .then((response) => {
        if (response.length == 0 && !req.body.githubToken) {
          next({
            code: 401
          });
        } else if (response.length == 0 && req.body.githubToken) {
          let name = req.body.name.split(' ');
          let userObj = {
            firstName: name[0],
            lastName: name[1],
            email: req.body.email,
            password: req.body.password
          }
          return new Promise(function (resolve, reject) {
            Model.User.create(userObj).then((response) => {
              resolve(generateToken(response._id, response.email))
              })
              .catch((err) => {
                reject(err)
              })
          })
        } else if (response.length != 0 && req.body.githubToken) {
          res.status(200).json(generateToken(response[0]._id, response[0].email));
        } else {
          if (verifyPassword(password, response[0].password)) {
            res.status(200).json(generateToken(response[0]._id, response[0].email));
          } else {
            next({
              code: 401
            });
          }
        }
      })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((err) => {
        next(err);
      })
  }
}

module.exports = User;