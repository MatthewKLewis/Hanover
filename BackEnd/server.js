const express = require("express");
const app = express();

//CV
//const cv = require('./opencv');
//console.log(cv.rectangle);

//const { proxy, _ } = require("rtsp-relay")(app);

// const handler = proxy({
//   url: `rtsp://192.168.5.140:9000/live`,
//   //url: `rtsp://192.168.1.113:9000/live`,
//   // if your RTSP stream need credentials, include them in the URL as above
//   verbose: true,
// });

app.use('/', express.static("../dist/Hanover"))

// the endpoint our RTSP uses
//app.ws("/api/stream", handler);

console.log("listening at port 2000");
app.listen(2000);