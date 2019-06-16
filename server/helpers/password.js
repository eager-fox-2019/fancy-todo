const bcrypt = require("bcryptjs");

module.exports = {
  hash(plain) {
    let salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plain, salt);
  },
  compare(plain, hash) {
    return bcrypt.compareSync(plain, hash);
  },
  generateRandom(num) {
    let pw = "";
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let n = charset.length;
    for(let i = 0; i < num; i ++) {
      pw += charset[(Math.floor(Math.random() * n))]
    }
    return pw
  },
}