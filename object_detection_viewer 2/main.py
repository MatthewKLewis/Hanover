import configparser
import json
import time
import threading

outputFrame = None
lock = threading.Lock()

from flask import Response
from flask import Flask
from flask import render_template

import cv2
from paho.mqtt import client as mqtt_client

CONFIG_FILE = "configs.conf"
CONFIG_SECT = "default"
LABEL_FILE = "labelmap.json"

# Number of seconds to retain the last detection on display if no new
# detection is present. This is to compensate for the difference in the
# refreshing rate between video frames and detections.

# # # # # PROBLEM IS THAT THERE IS TWO WHILE LOOPS, THERE SHOULD ONLY BE ONE, WITH ALL THE DRAWING IN IT!

DETECTION_RETENTION = 1
DETECTION_DISPLAY_COLOR_GOOD = [98, 195, 35]
DETECTION_DISPLAY_COLOR_BAD = [35, 98, 195]

# FLASK area
app = Flask(__name__)

@app.route("/")
def index():
	# return the rendered template
	return render_template("index.html")

def generate():
	# grab global references to the output frame and lock variables
	global outputFrame, lock
	# loop over frames from the output stream
	while True:
		# wait until the lock is acquired
		with lock:
			# check if the output frame is available, otherwise skip
			# the iteration of the loop
			if outputFrame is None:
				continue
			# encode the frame in JPEG format
			(flag, encodedImage) = cv2.imencode(".jpg", outputFrame)
			# ensure the frame was successfully encoded
			if not flag:
				continue
		# yield the output frame in the byte format
		yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + 
			bytearray(encodedImage) + b'\r\n')

@app.route("/video_feed")
def video_feed():
	# return the response generated along with the specific media
	# type (mime type)
	return Response(generate(),
		mimetype = "multipart/x-mixed-replace; boundary=frame")

# global variables
mqtt_connected = False
detections = []
last_detection_time = time.time()

def mqtt_on_connect(client, userdata, flags, rc):
    if rc == 0:
        global mqtt_connected
        mqtt_connected = True
    else:
        raise RuntimeError("MQTT connection failed.")


def mqtt_on_message(client, userdata, msg):
    global detections
    global last_detection_time
    payload = json.loads(msg.payload)
    outputs = payload.get("outputs")
    if not outputs:
        return
    detections = outputs
    last_detection_time = time.time()


def main():
    global detections
    global last_detection_time

    try:
        config_parser = configparser.ConfigParser()
        config_parser.read(CONFIG_FILE)
        config = config_parser[CONFIG_SECT]
    except Exception:
        print("Unable to read config from file: {}".format(CONFIG_FILE))
        return
    
    try:
        with open(LABEL_FILE) as f:
            label_map = json.load(f)
    except Exception:
        print("Unable to read label from file: {}".format(LABEL_FILE))
        return

    try:
        client = mqtt_client.Client("mv_custom_analytics_client")
        client.on_connect= mqtt_on_connect
        client.on_message = mqtt_on_message
        client.connect(config.get("mqtt_broker_host"),
                port=int(config.get("mqtt_broker_port")))
        print("/merakimv/{}/custom_analytics".format(
                config.get("camera_serial")))
        client.subscribe("/merakimv/{}/custom_analytics".format(
                config.get("camera_serial")), 0)
        client.loop_start()
        while not mqtt_connected:
            time.sleep(1.0)
        print("MQTT broker connected.")
    except Exception:
        print("Unable to connect to MQTT broker.")
        return

    vs = cv2.VideoCapture(config.get("camera_rtsp"))
    last_detection_time = time.time()

    # LOOP
    while True:
        ret, outputFrame = vs.read()
        """
        if outputFrame is None:
            print('No outputFrame')
            continue
        """
        if detections:
            for detection in detections:
                detection_class = detection["class"]
                score = detection["score"]
                location = detection["location"]
                if str(detection_class) not in label_map.keys():
                    continue
                startX = int(location[1] * outputFrame.shape[1])
                startY = int(location[0] * outputFrame.shape[0])
                endX = int(location[3] * outputFrame.shape[1])
                endY = int(location[2] * outputFrame.shape[0])

                label = "{}: {:.2f}%".format(
                        label_map.get(str(detection_class)), score * 100)
                cv2.rectangle(outputFrame, (startX, startY), (endX, endY), DETECTION_DISPLAY_COLOR_GOOD if (detection_class == 1) else DETECTION_DISPLAY_COLOR_BAD, 3)
                y = startY - 15 if startY - 15 > 15 else startY + 15
                y = startY + 30
                x = startX + 3
                cv2.putText(outputFrame, label, (x, y), cv2.FONT_HERSHEY_SIMPLEX, .8, DETECTION_DISPLAY_COLOR_GOOD if (detection_class == 1) else DETECTION_DISPLAY_COLOR_BAD, 2)

        if (time.time() - last_detection_time >= DETECTION_RETENTION):
            detections = []

        # # display the outputFrame # RE-STREAM INSTEAD?
        # cv2.imshow("outputFrame", outputFrame)
        # if cv2.waitKey(1) & 0xFF == ord('q'):
        #     break

        # display the outputFrame # RE-STREAM INSTEAD?
        (flag, encodedImage) = cv2.imencode(".jpg", outputFrame)
        print(encodedImage)


if __name__ == "__main__":

    monitoring_thread = threading.Thread(target = main)
    monitoring_thread.start()
    
    app.run()
