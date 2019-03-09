const PortManager = require('./port-manager')
var sessionstorage = require('sessionstorage');
var shell = require('shelljs');
const fs = require('fs');

const portManager = new PortManager();

const appiumSessions = [];

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
                port = freePort
                var child = shell.exec('appium -p ' + port, {async:true});
                
                var sessionInfo = {
                    port: port,
                    proccess: child,
                    logPath: ""
                }

               appiumSessions.push(sessionInfo)

                child.stdout.on('data', function(data) {
                    console.log(port + " : " + data.toString()); 
                });
            })
            .then(() => {
                portManager.waitPort(port)
                .then(() => resolve(port))
            })
            
        })
    }

    /*
    Terminate Appium process
    */
    terminateAppium(port) {
        var singleSession = appiumSessions.find(function(session) {
            return session.port == port;
        });
        singleSession.proccess.kill();
    }

    /*
    Returns live sessions
    */
    getAllSessions() {
        return appiumSessions.filter(session => !session.proccess.killed);
    }
    
    checkStaleSessions() {
        appiumSessions = appiumSessions.filter(session => !session.proccess.killed);
    }
 }
