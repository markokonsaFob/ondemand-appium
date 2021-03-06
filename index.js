const app = require('express')();
const proxy = require('http-proxy-middleware');
const AppiumService = require('./appium-service')
const port = 4723
const request = require('request');
const bodyParser = require('body-parser');
var sessionstorage = require('sessionstorage');
const DeviceManager = require("./device-manager")

const devicemanager = new DeviceManager();
const appiumService = new AppiumService();

app.use(bodyParser.json());

app.post('/wd/hub/session', function (req, res) {
    console.log("Create session called...")
    appiumService.startAppium().then(target => {
        request.post(
            "http://127.0.0.1:"+target + '/wd/hub/session',
            { json: req.body },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    sessionstorage.setItem(response.body.sessionId, {port: target, body: body})
               } else {
                    console.log("Create session failed cause: " + body.value.message)
               }
               res.status(response.statusCode).send(body)
            }
        );
    })
  })

app.all('/wd/hub/session/:session_id/**', proxy({
    target: 'http://127.0.0.1',
    changeOrigin: true,
    logLevel: 'silent',
    router: request => {
        console.log("Action perform called...")
        var session = sessionStorage.getItem(req.param.session_id)
        return "http:/127.0.0.1:" + session.port
    },
    onError: (err, req, res) => {
      console.log("Appium reqest error: " + err.message)
      res.end(err.message);
    }
}));

app.delete('/wd/hub/session/:session_id', proxy({
    target: 'http://127.0.0.1',
    changeOrigin: true,
    logLevel: 'silent',
    router: request => {
        console.log("Delete session called...")
        var session = sessionStorage.getItem(req.param.session_id)
        sessionStorage.removeItem(req.param.session_id)
        return "http:/127.0.0.1:" + session.port
    },
    onError: (err, req, res) => {
      console.log("Appium reqest error: " + err.message)
      res.end(err.message);
    }
}));

app.get('/sessions', function (req, res) {
  res.send(JSON.stringify(appiumService.getAllSessions()))
})

app.get('/devices', function (req, res) {
  res.send(JSON.stringify(devicemanager.getDevices()))
})

app.listen(port, () => console.log(`Appium On-Demand Service listening on port ${port}!`))
