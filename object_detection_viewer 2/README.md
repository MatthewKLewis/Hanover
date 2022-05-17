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
