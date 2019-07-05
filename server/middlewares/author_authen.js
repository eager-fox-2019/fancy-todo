const { decodeToken } = require('../helpers/jwtHelper')
const User = require('../models/modelUser')
const Token = require('../models/modelBlacklistToken')
const Task = require('../models/modelTask')
const ObjectId = require('mongoose').Types.ObjectId; 

module.exports = {
  authentication: (req, res, next) => {
    try {
      console.log('######checking authentication');
      let payload = decodeToken(req.headers.token)
      console.log('payload', payload);
      console.log('req.headers.token', req.headers.token);
      console.log('req.params.taskId', req.params.taskId);
      
      Promise.all([User.findOne({_id: payload.userId}), Token.findOne({token: req.headers.token})])
        .then(result => {
          let [user, token] = result
          if (!user) {
            console.log('authentication user fail');
            next({ code: 401 })
          } else {
            if (token) {
              console.log('authentication token fail');
              next({ code: 404, message: 'Please logout and login again'})
            } else {
              console.log('authentication user and token success');   
              next()
            }
          }
        })
        .catch(next)
    } catch (err) {
      next({error: err})
    }
    
  },
  authorization: function(req, res, next) {
    try {
      console.log('######checking authorization');
      console.log('params.taskId ', req.params.taskId);
      
      Promise.all([decodeToken(req.headers.token), Task.findOne({ _id: req.params.taskId })])
        .then((values) => {
          console.log('hasil authorization token', values[0]);
          console.log('hasil authorization token id type', typeof values[0].userId);
          console.log('hasil find task', values[1]);
          console.log('hasil find task', typeof values[1]._id.toString());
          console.log('result', values[0].userId !== values[1].user_id.toString());
          
          if (values[0].userId !== values[1].user_id.toString()) {
            console.log('unauthorized');
            next({ code: 404 })
          } else {
            console.log('authorization done');
            next()
          }
        })
    } catch (err) {
      next({error: err})
    }
  }
}