import { IMqttMessage, IMqttServiceOptions, MqttService } from 'ngx-mqtt';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export interface Message {
  "azim": number,
  "azim_std": number,
  "elev": number,
  "elev_std": number,
  "timestamp": number,
  "tag-ble-id": string,
}

export interface Position {
  "tag-ble-id" : string,
  "lastX": number,
  "lastY": number,
  "x" : number,
  "y" : number,
}

@Injectable({
  providedIn: 'root'
})
export class AngularMqttService {

  topic: string = 'aoa-test';
  subscription?: Subscription;
  MQTT_SERVICE_OPTIONS?: IMqttServiceOptions;
  message$ = new BehaviorSubject(null);

  constructor(private _mqttService: MqttService) {
    this.MQTT_SERVICE_OPTIONS = {
      hostname: 'localhost',
      port: 9001,
      protocol: 'ws',
      path: '/ws',
    };
    this._mqttService.connect(this.MQTT_SERVICE_OPTIONS);
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  subscribe(topic: string) {
    this.subscription = this.subscribeToQueue(topic).subscribe(
      (data: IMqttMessage) => {
        const XM = JSON.parse(data.payload.toString());
        this.message$.next(XM);
      }
    );
  }

  subscribeToQueue(topic: string): Observable<IMqttMessage> {
    return this._mqttService.observe(topic);
  }
}
