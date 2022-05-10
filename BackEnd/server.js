const express = require("express");
const app = express();

const { proxy, _ } = require("rtsp-relay")(app);

const handler = proxy({
  url: `rtsp://192.168.5.140:9000/live`,
  // if your RTSP stream need credentials, include them in the URL as above
  verbose: true,
});

// the endpoint our RTSP uses
app.ws("/api/stream", handler);

console.log("listening at port 2000");
app.listen(2000);