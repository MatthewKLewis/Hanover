# Object Detection Client

This exanple demonstrates a basic client app that receives and processes custom object detection outputs from the camera. The app gets video frames from camera's RTSP stream, and object detection outputs from MQTT broker, then displays them on the screen.

## Setup

* (Optional) Setup a virtualenv

```
python3 -m venv venv
source venv/bin/activate
```

* Install dependencies

```
pip3 install -r requirements.txt
```

* Make sure that external RTSP has been enabled on the camera.

## Configure

* Edit the `configs.conf` file to provide necessary information, including RTSP link, MQTT broker and camera details.
* Edit the `labelmap.json` file to configure the mapping between the detection class output and the corresponding object label.

## Run

```
python3 main.py
```

When the app receives detection results from MQTT, it should display them as bounding boxes.

# Sample

{"outputs":[{"class":1,"id":49,"location":[0.463,0.465,0.526,0.556],"score":0.995},{"class":0,"id":50,"location":[0.619,0.53,0.683,0.652],"score":0.99},{"class":1,"id":51,"location":[0.653,0.665,0.718,0.778],"score":0.988},{"class":1,"id":52,"location":[0.446,0.593,0.51,0.692],"score":0.984},{"class":1,"id":53,"location":[0.526,0.621,0.591,0.714],"score":0.982},{"class":1,"id":54,"location":[0.55,0.485,0.61,0.577],"score":0.961}],"timestamp":1680629486484}
