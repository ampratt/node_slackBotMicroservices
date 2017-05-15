'use strict';

const request = require('superagent')
const locationKey = require('../../../docs/geoLocationKey.js')

module.exports.process = function process(intentData, registry, cb) {
	console.log(`intent: ${intentData.intent[0].value}`)

	if(intentData.intent[0].value !== 'weather')
		return cb(new Error(`Expected weather intent, but got ${intentData.intent[0].value}`))

	if(!intentData.location) {
		// return cb(new Error('Missing location in weather intent'))

		request.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${locationKey}`, (err, res) => {
			if(err) {
				console.log(err)
				// console.log(res)
				return
			}
			// let coords = `lat=${res.body.location.lat}&lon=${res.body.location.lng}`
			let coords = res.body.location.lat + ',' + res.body.location.lng
			console.log(coords)
			
			// use registry before request
		    const service = registry.get('weather')
		    if(!service) return cb(false, 'No service available');

			request.get(`http://${service.ip}:${service.port}/service/${coords}`, (err, res) => {
				if(err || res.statusCode != 200){
					console.log(err)
					return cb(false, `I (WeatherIntent) had a problem finding out the weather in ${coords}`)
				}	
				return cb(false, `The weather is now ${res.body.result}`)

			})
		})		
		// getLocation()

	} else {

		// temp, dont have ai yet
		const location = intentData.location[0].value.replace(/,.*?jarvis/i, '')

		// use registry before request
	    const service = registry.get('weather')
	    if(!service) return cb(false, 'No service available');

		request.get(`http://${service.ip}:${service.port}/service/${location}`, (err, res) => {
			if(err || res.statusCode != 200 || !res.body.result){
				console.log(err)
				return cb(false, `I had a problem finding out the weather in ${location}`)
			}	
			return cb(false, `The weather in ${location} is now ${res.body.result}`)

		})
		// return cb(false, `OH! I don't yet know the weather in ${intentData.location[0].value}`)
	}
}