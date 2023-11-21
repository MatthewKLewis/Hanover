import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AngularMqttService {

  MQTT_SERVICE_OPTIONS?: IMqttServiceOptions;

  subPositions?: Subscription;
  subMachineVision?: Subscription;

  positions$ = new BehaviorSubject(null);
  machineVisions$ = new BehaviorSubject(null);

  constructor(private _mqttService: MqttService) {
    this.MQTT_SERVICE_OPTIONS = {
      hostname: '192.168.12.231',
      port: 9001,
      protocol: 'ws',
      path: '/ws',
    };
    this._mqttService.connect(this.MQTT_SERVICE_OPTIONS);
    this.initialize();
  }

  initialize() {
    console.log("init")
    this.subPositions = this.subscribeToQueue('AoA-Position').subscribe(
      (data: IMqttMessage) => {
        const XM = JSON.parse(data.payload.toString());
        this.positions$.next(XM);
      }
    );

    this.subMachineVision = this.subscribeToQueue('/merakimv/Q2JV-XAYQ-NSGH/custom_analytics').subscribe(
      (data: IMqttMessage) => {
        const XM = JSON.parse(data.payload.toString());
        this.machineVisions$.next(XM);
      }
    );
  }

  disconnect() {
    this.subPositions && this.subPositions.unsubscribe();
    this.subMachineVision && this.subMachineVision.unsubscribe();
  }

  subscribeToQueue(topic: string): Observable<IMqttMessage> {
    return this._mqttService.observe(topic);
  }
}
