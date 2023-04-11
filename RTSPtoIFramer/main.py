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

# FLASK area
app = Flask(__name__)

@app.route("/")
def index():
	# return the rendered template
	return render_template("index.html")

def generate():
    while True:
        global outputFrame, lock, detections, last_detection_time
        ret, outputFrame = vs.read()
        if outputFrame is None:
            # print('No outputFrame')
            continue
        # display the outputFrame # RE-STREAM INSTEAD?
        (flag, encodedImage) = cv2.imencode(".jpg", outputFrame)
        yield(b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + bytearray(encodedImage) + b'\r\n')

@app.route("/video_feed")
def video_feed():
	# return the response generated along with the specific media
	# type (mime type)
	return Response(generate(), mimetype = "multipart/x-mixed-replace; boundary=frame")


def main():
    vs = cv2.VideoCapture("rtsp://192.168.1.110:554/h264cif?username=admin&password=123456")
    last_detection_time = time.time()

    # LOOP
    while True:
        ret, outputFrame = vs.read()
        if outputFrame is None:
            # print('No outputFrame')
            continue


if __name__ == "__main__":
    vs = cv2.VideoCapture("rtsp://192.168.1.110:554/h264cif?username=admin&password=123456")
    app.run(port=5001)