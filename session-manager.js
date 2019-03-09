const shell = require('shelljs');

const activeSessions = [];

module.exports = class SessionManager {

    /*
    Start Appium service on specified port
    */
    startAppium(port) {
        console.log("Starting Appium service for " + port)
        shell.exec(`appium -p ${port}`)

        // Wait for port to become live
    }

    /*
    Get Active session from sessionId

    Returns sessionId and port
    */
    getActiveSession(sessionId) {
        activeSessions.find(function(element) {
            return element.sessionId == sessionId;
          });
    }

    /*
    Add session to Active session
    */
    addSession(sessionId, port) {
        activeSessions.push(
            {
                sessionId: sessionId,
                port: port
            }
        );
    }

    /*
    Delete session from active sessions
    */
    deleteSession(sessionId) {
       activeSessions = activeSessions.filter(session => session.sessionId != sessionId);
    }

}