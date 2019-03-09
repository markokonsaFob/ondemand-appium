const PortManager = require('./port-manager')
const { spawn } = require('child_process')
var sessionstorage = require('sessionstorage');

const portManager = new PortManager();

module.exports = class AppiumService {
    
    /*
    Start Appium service on specified port
    */
    startAppium() {
        var port
        console.log("Starting appium...")

        return new Promise((resolve, reject) => {
            portManager.findAvailablePort()
            .then(freePort => {
                console.log("Found port: " + freePort)
                let command = 'appium';
                let args = ['-p', freePort, '--default-capabilities', JSON.stringify({
                newCommandTimeout: 180, clearSystemFiles: true,
                })];
        
                port = freePort
                spawn( command, args, { detached:true })
            })
            .then(() => {
                portManager.waitPort(port)
                .then(() => portManager.findProcessId(port))
                .then(pid => {sessionstorage.setItem(port, {proccessId: pid})})
                .then(() => resolve(port))
            })
            
        })
    }

    /*
    Terminate Appium process
    */
    terminateAppium(port) {
        return new Promise((resolve, reject) => {
            portManager.findProcessId(port).then(processVariable => {
                portManager.terminateProcess(processVariable.pid)
            })
        });
    }

 }