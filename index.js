const app = require('express')();
const proxy = require('http-proxy-middleware');
const shell = require('shelljs');
const port = 4723

app.post('/wd/hub/session', proxy({
  target: 'http://127.0.0.1',
  changeOrigin: true,
  logLevel: 'silent',
  router: request => {
        /*
            1. Find available port
            2. Start Appium service on given port
            3. Save given port together with Session-ID
            4. Return response to the Client

            EXAMPLE OF STARTING APPIUM:
            shell.exec('appium -p 4444')
        */
  },
  onError: (err, req, res) => {
    console.log("Appium reqest error: " + err.message)
    res.end(err.message);
  }
}));

app.all('/wd/hub/session/:session_id/**', proxy({
    target: 'http://127.0.0.1',
    changeOrigin: true,
    logLevel: 'silent',
    router: request => {
          /*
              1. Find port for given session_id parameter
              2. Proxy reuqest to right port
              3. Return response to the Client
          */
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
          /*
              1. Find port for given session_id parameter
              2. Proxy reuqest to right port
              3. Return response to the Client
              4. Terminate Appium service on given Port
          */
    },
    onError: (err, req, res) => {
      console.log("Appium reqest error: " + err.message)
      res.end(err.message);
    }
}));

app.use(haltOnTimedout);
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

app.listen(port, () => console.log(`Appium On-Demand Service listening on port ${port}!`))
