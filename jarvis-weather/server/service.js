'use strict';

const request = require('superagent')
const express = require('express')
const service = express()

const weatherKey = require('../../docs/weatherKey.js')

function kelvinToCelsius(k) {
	return k - 273.15
}

service.get('/service/:location', (req, res, next) => {

    request.get('http://api.openweathermap.org/data/2.5/weather?q='
                + req.params.location
                + '&appid=' + weatherKey, 
                (err, response) => {
	            	if(err) {
	            		console.log(err)
	            		return res.sendStatus(404)
	            	}

	            	res.json({ result: `${kelvinToCelsius(response.body.main.temp)} C, and ${response.body.weather[0].description}` })
	            	// res.json({ result: `${response.body.main.temp} degress and ${response.body.weather[0].description}` })
                })
})

module.exports = service