var mqtt = require('mqtt');
const MQTT_URI = 'ws://localhost:9001'
const testTopic = "Test";
var mqttClient = mqtt.connect(MQTT_URI) //no options
mqttClient.on("error", ()=>{
    console.log('error')
})

var totalSent = 0;
var timestamp = 0;

function randomOfThreeMACs(min, max) { // min and max included
    let random = Math.random()
    return random > .66 ? "C4:CB:6B:00:11:22" : random > .33 ? "C4:CB:6B:11:22:33" : "C4:CB:6B:22:33:44"
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function createSamplePacket() {
    timestamp++;
    return {
        "mac" : randomOfThreeMACs(),
        "azim": randomIntFromInterval(0, 360),
        "azim_std": randomIntFromInterval(0, 360),
        "elev": randomIntFromInterval(1, 55),
        "elev_std": randomIntFromInterval(1, 55),
        "timestamp": timestamp
    }
}

setInterval(()=>{
    var testObj = createSamplePacket()
    mqttClient.publish(testTopic, JSON.stringify(testObj), {}, ()=>{
        totalSent++;
        console.log('sent ' + totalSent)
    })
}, 500)