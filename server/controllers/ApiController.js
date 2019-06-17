const axios = require('axios')

const AX_BORED_API = axios.create({
    baseURL: 'http://www.boredapi.com/api',
})
const AX_WEATHER_API = axios.create({
    baseURL: 'http://api.openweathermap.org/data/2.5'
})

class OpenApiController {
    static generateRandomActivity(req, res) {
        AX_BORED_API
        .get('/activity')
        .then(({data}) => {
            res.status(200).json(data.activity)
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }

    static getCurrentWeather(req, res) {
        const LAT = req.body.lat
        const LNG = req.body.lng
        const WEATHER_KEY = process.env.WEATHER_KEY

        AX_WEATHER_API
        .get(`/weather?lat=${LAT}&lon=${LNG}&APPID=${WEATHER_KEY}`)
        .then(({data}) => {
            if(data) {
                res.status(200).json(data)
            }else{
                res.status(400).json('Location error')
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}

module.exports = OpenApiController
