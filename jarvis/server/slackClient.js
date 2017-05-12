'use strict';

const RtmClient = require('@slack/client').RtmClient;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS
const RTM_EVENTS = require('@slack/client').RTM_EVENTS

let rtm = null
let nlp = null 	// natural language processor
let registry = null

function handleOnAuthenticated(rtmStartData){
	console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel.`)
}
function addAuthenticatedHandler(rtm, handler) {
	rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, handler)
}


function handleOnMessage(message) {
	// console.log(message)

	if(message.text.toLowerCase().includes('jarvis')) {
		nlp.ask(message.text, (err, res) => {
			if (err) {
				console.log('error: ' + err);
				return;
			}

			try {
				if(!res.intent || !res.intent[0] || !res.intent[0].value)
					throw new Error("Error: Could not extract intent!")

				const intent = require('./intents/' + res.intent[0].value + 'Intent')
				
				intent.process(res, registry, (err, res) => {
					if(err){
						console.log(err.message)
						return
					}

					return rtm.sendMessage(res, message.channel)
				})

			} catch(err) {
				console.log(err)
				console.log(res)
				rtm.sendMessage("Sorry, I don't know what you are talking about", message.channel)
			}
		})
	}


}

module.exports.init = function slackClient(token, logLevel, nlpClient, serviceRegistry) {
	rtm = new RtmClient(token, { logLevel: logLevel})
	nlp = nlpClient
	registry = serviceRegistry
	addAuthenticatedHandler(rtm, handleOnAuthenticated)
	rtm.on(RTM_EVENTS.MESSAGE, handleOnMessage)
	return rtm
}

module.exports.addAuthenticatedHandler = addAuthenticatedHandler;
// rtm.start()