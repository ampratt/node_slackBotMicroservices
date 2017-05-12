'use strict';

const request = require('superagent')

module.exports.process = function process(intentData, registry, cb) {

	if(intentData.intent[0].value !== 'weather')
		return cb(new Error(`Expected weather intent, but got ${intentData.intent[0].value}`))

	if(!intentData.location) return cb(new Error('Missing location in weather intent'))

	// temp, dont have ai yet
	const location = intentData.location[0].value.replace(/,.?jarvis/i, '')

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