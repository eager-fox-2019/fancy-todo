const jwt = require('jsonwebtoken');

module.exports = (_id, email) => {
  return jwt.sign({_id, email}, process.env.TOKEN_SECRET);
}