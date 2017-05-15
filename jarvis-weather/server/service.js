'use strict';

const request = require('superagent')
const express = require('express')
const service = express()

const weatherKey = require('../../docs/weatherKey.js')

function kelvinToCelsius(k) {
	return Math.round(k - 273.15, 0)
}

// request with a Location by name
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
                });
})


// request with coords sent in
service.get('/service/weather/:coords', (req, res, next) => {
	
	console.log("RUNNING COORDS Weather API")
	
	// lat, lon
	const coords = req.params.coords.split(",")
	console.log("inside: " + coords[0] + ' - ' + coords[1])	//console.log('lat=' + coords[0] + '&lon=' + coods[1])
	// http://api.openweathermap.org/data/2.5/weather?lat=60.4317717&lon=22.1739878&appid=6194aa3d74b98de69b10fc4478bc3fb9
												   // lat=60.4317717&lon=22.1739878
    request.get('http://api.openweathermap.org/data/2.5/weather?lat='
               	+ coords[0] + '&lon=' + coords[1] +
                + '&appid=' + weatherKey, 
		        (err, response) => {
		        	if(err) {
		        		// console.log(err)
		        		return res.sendStatus(404)
		        	}

		        	res.json({ result: `${kelvinToCelsius(response.body.main.temp)} C, and ${response.body.weather[0].description}` })
		        	// res.json({ result: `${response.body.main.temp} degress and ${response.body.weather[0].description}` })
    			})

})


module.exports = service