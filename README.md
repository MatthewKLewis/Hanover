# Hanover

Dashboard incorporating an RTSP live stream from a Meraki Security Camera, an OpenLayers map, and business analytics.

# Prep
- Sign in to the Meraki Dashboard.
- Forward RTSP to an address
- Forward detection metadata to a local MQTT stream
- Make sure the configs.conf file has the right IPs, ports, and serial numbers.

# Startup
- Start server.js in BackEnd.
- Start main.py in object_detection_viewer_2
- Open your browser to localhost:2000