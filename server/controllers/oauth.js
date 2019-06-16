const axios = require('axios');

class OAuth {

  static githubOauth(req, res, next) {
    axios({
      method: 'POST',
      url: `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.body.requestToken}`,
      headers: {
        accept: 'application/json'
      }
    })
    .then((response) => {
      res.status(200).json(response.data);
    })
    .catch((err) => {
      next(err);
    })
  }
}

module.exports = OAuth;