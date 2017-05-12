'use strict';

const request = require('superagent')
const moment = require('moment')
const express = require('express')
const service = express()

const geoKey = require('../../docs/geoKey.js')
const timeKey = require('../../docs/timeKey.js')

// geo-req: https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=YOUR_API_KEY
// time-req: https://maps.googleapis.com/maps/api/timezone/json?location=39.6034810,-119.6822510&timestamp=1331161200&key=YOUR_API_KEY

service.get('/service/:location', (req, res, next) => {
	request.get('https://maps.googleapis.com/maps/api/geocode/json?address=' 
				+ req.params.location 
				+ '&key=' + geoKey,
				(err, response) => {
					if(err) {
						console.log(err)
						return res.sendStatus(500)
					}

					// TODO- re-ask user in case of needing a more specific location
					// res.json(response.body.results[0].geometry.location)
					
					// lat, lon
					const location = response.body.results[0].geometry.location
					const timestamp = +moment().format('X')	// +moment yeilds integer

					request.get('https://maps.googleapis.com/maps/api/timezone/'
						+ 'json?location=' + location.lat + ',' + location.lng
						+ '&timestamp=' + timestamp
						+ '&key=' + timeKey,
						(err, response) => {
							if(err) {
								console.log(err)
								return res.sendStatus(500)
							}

							const result = response.body
							// moment().format('LLLL')
							const timeString = moment.unix(timestamp + result.dstOffset + result.rawOffset)
													.utc().format('LLLL');	//.utc().format('dddd, MMMM, Do YYYY, h:mm:ss a')

							res.json( { result: timeString } )
						})
				});
    // res.json( { result: req.params.location } )
})

module.exports = service