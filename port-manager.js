// JavaScript source code
const wp = require('wait-for-port');
const findFreePort = require('detect-port');
const find = require('find-process');

module.exports = class PortManager{
	
	/*
	Find available port
	*/
	findAvailablePort() {
		return new Promise((resolve, reject) => {
			return findFreePort(4000)
				.then(freePort => {
					resolve(freePort)
				})
				.catch(err => reject(err))
		})
	}


	/*
	Find process id of process running on port
	*/
	findProcessId(port){
		return new Promise((resolve, reject) => {
		find('port', port)
			.then(function (list) {
				resolve(list[0])
			}, function (err) {
				reject(err)
			})
		})
	}


	/*
	Terminate process with process id
	*/
	terminateProcess(id){
		process.kill(id)
	}

	/*
	Wait for port 
	*/
	waitPort(port){
		return new Promise((resolve, reject) => {
			wp('127.0.0.1', port, { numRetries: 60, retryInterval: 1000 },
			  error => error ? reject(error) : resolve());
		});
	}

}

