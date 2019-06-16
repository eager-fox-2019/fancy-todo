const axios = require('axios')
let ax = {}
ax.voice = axios.create({
	baseURL:`http://api.voicerss.org?key=${process.env.VOICE_API}`
})

module.exports = ax