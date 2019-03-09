const app = require('express')();
const proxy = require('http-proxy-middleware');
const port = 4723

app.post('/wd/hub/session', proxy({
  target: 'http://127.0.0.1',
  changeOrigin: true,
  router: request => {
      console.log("Appium request: " + request.method)
  },
  onError: (err, req, res) => {
    const msg = `Error: ${err}`;
    console.log("Appium reqest error: " + msg)
    res.status(400).end(msg);
  },
}));

app.use(haltOnTimedout);
function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

app.listen(port, () => console.log(`Appium On-Demand Service listening on port ${port}!`))
