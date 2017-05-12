'use strict'
/*
	WIT REQUEST
curl \
 -H 'Authorization: Bearer 'TOKEN' ' \
 'https://api.wit.ai/message?v=20170511&q='
*/
const request = require('superagent')

function handleWitResponse(res) {
	// console.log(res)
	return res.entities
}

module.exports = function witClient(token) {
	const ask = function ask(message, cb) {	//asyn function with callback

		request.get('https://api.wit.ai/message')
			.set('Authorization', 'Bearer ' + token)
			.query({v: '20170511'})
			.query({q: message})
			.end( (err, res) => {
				if(err) return cb(err);
				if(res.statusCode !== 200) return cb('Expected status 200 but got ' + res.statusCode)
			
				const witResponse = handleWitResponse(res.body)
				return cb(null, witResponse)
			})

		// console.log('ask: %s', message)
		// console.log('ask: %s', token)
	}

	return {
		ask: ask
	}
}