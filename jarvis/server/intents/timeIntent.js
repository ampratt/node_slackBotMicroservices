'use strict';

const request = require('superagent')
const locationKey = require('../../../docs/geoLocationKey.js')


// let location = null

module.exports.process = function process(intentData, registry, cb) {

	if(intentData.intent[0].value !== 'time')
		return cb(new Error(`Expected time intent, but got ${intentData.intent[0].value}`))

	if(!intentData.location) {

		request.post(`https://www.googleapis.com/geolocation/v1/geolocate?key=${locationKey}`, (err, res) => {
			if(err) {
				console.log(err)
				// console.log(res)
				return
			}
			let coords = res.body.location.lat + ',' + res.body.location.lng
			console.log(coords)

			// use registry before request
		    const service = registry.get('time')
		    if(!service) return cb(false, 'No service available');

			request.get(`http://${service.ip}:${service.port}/service/${coords}`, (err, res) => {
				if(err || res.statusCode != 200 || !res.body.result){
					console.log(err)

					return cb(false, `I had a problem finding out the time in ${coords}`)
				}	

				return cb(false, `The time is now ${res.body.result}`)

			})

		})		

		// getLocation()
		// return cb(false, "The time depends on what location you mean?")	//cb(new Error('Missing location in time intent'))
	} else {
		// const, dont have ai yet
		let location = intentData.location[0].value.replace(/,.?jarvis/i, '')

		// use registry before request
	    const service = registry.get('time')
	    if(!service) return cb(false, 'No service available');

		request.get(`http://${service.ip}:${service.port}/service/${location}`, (err, res) => {
			if(err || res.statusCode != 200 || !res.body.result){
				console.log(err)

				return cb(false, `I had a problem finding out the time in ${location}`)
			}	

			return cb(false, `The time in ${location} is now ${res.body.result}`)

		})
	}
	// return cb(false, `OH! I don't yet know the time in ${intentData.location[0].value}`)

}