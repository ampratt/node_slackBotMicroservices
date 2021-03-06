'use strict';

class ServiceRegistry {
	
	constructor() {
		this._services = []
		this._timeout = 15
	}

	add(intent, ip, port) {
		// uniquely identiy services
		const key = intent + ip + port

		if(!this._services[key]) {
			// register new service in hash map
			this._services[key] = {}
			this._services[key].timestamp = Math.floor(new Date() / 1000)
			this._services[key].ip = ip
			this._services[key].port = port
			this._services[key].intent = intent
			
			// debuggin tmp
			console.log(`Added service for intent ${intent} on ${ip}:${port}`)
			this._cleanup()
			return;
		}

		// if service exists, update timestamp
		this._services[key].timestamp = Math.floor(new Date() / 1000)
		console.log(`UPDATED service for intent ${intent} on ${ip}:${port}`)
		this._cleanup()
	}

    remove(intent, ip, port) {
        const key = intent + ip + port
        delete this._services[key]
    }

	get(intent) {
		this._cleanup()
		// this._services.filter( (service) => { (service.intent == intent) })
		for(let key in this._services) {
			if(this._services[key].intent == intent) return this._services[key];
		}
		return null
	}

    _cleanup() {
        const now = Math.floor(new Date() / 1000)
        
        for(let key in this._services) {
            if(this._services[key].timestamp + this._timeout < now) {
                console.log(`Removed service for intent ${this._services[key].intent}`)
                delete this._services[key]
            }
        }
    }

} 

module.exports = ServiceRegistry;