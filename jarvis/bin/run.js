'use strict'

const slackClient = require('../server/slackClient')
const service = require('../server/service')
const http = require('http')
const server = http.createServer(service)	// initiate server

// wit AI setup
const witToken = require('../../docs/witToken.js')	//'H4RH5JZIUBIRJLQNBFTCUL7AQ6O2YGJT';
const witClient = require('../server/witClient')(witToken)

// slack setup stuff
const slackToken = 	require('../../docs/slackToken.js'); //'xoxb-182069242466-CGUTfMzv09aNjDBm0SKfmcKB';
const slackLogLevel = 'verbose';

const serviceRegistry = service.get('serviceRegistry')
const rtm = slackClient.init(slackToken, slackLogLevel, witClient, serviceRegistry)
rtm.start()

slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000) )


server.on('listening', () => {
	console.log(`JARVIS is listening on port ${server.address().port} in ${service.get('env')} mode.`)
	
})

