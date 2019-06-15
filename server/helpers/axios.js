const axios = require('axios')
let ax = axios.create({
	baseURL:'https://api.github.com',
    headers: {
        "Authorization": `token ${process.env.GITHUB_APIKEY}`,
        "Accept": "application/vnd.github.v3.star+json"
    }
})

module.exports = ax