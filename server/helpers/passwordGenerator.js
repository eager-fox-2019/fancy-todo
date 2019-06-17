var generatePassword = require("password-generator");

module.exports = {
  customPassword() {
    var maxLength = 18;
    var minLength = 12;
    var randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
    return generatePassword(randomLength, false, /[\w\d\?\-]/);
  }
}