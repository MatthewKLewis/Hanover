import { IMqttMessage, IMqttServiceOptions, MqttService as NGXMQTTService } from 'ngx-mqtt';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export class MqttService {
  associatedDevicesOnly$ = new BehaviorSubject<boolean>(false);
  expansionOptions: string[] = [];
  liveFeed: string = 'live';
  locationTestingZone: any = { Id: 0, Name: '', MapID: 0 };
  maxMessageCount: number = 25;
  ruleToBeValidated: any = { Id: 0, Name: '', RuleDef: '' };
  selectedDevices: string[] = [];
  selectedInfras: string[] = [];
  selectedLocations: string[] = [];
  sendMessageSub?: Subscription;
  subscription?: Subscription;
  topicIncoming: string = 'AoA-Test';
  treeOptions: string[] = ['autoscroll'];
  MQTT_SERVICE_OPTIONS?: IMqttServiceOptions;
  shayanBehaviorSubject = new BehaviorSubject(null);

  constructor(private _mqttService: NGXMQTTService) {
    this.MQTT_SERVICE_OPTIONS = {
      hostname: 'localhost',
      port: 1883,
      protocol: 'ws',
      path: '/ws',
    };
    this._mqttService.connect(this.MQTT_SERVICE_OPTIONS);
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.sendMessageSub) {
      this.sendMessageSub.unsubscribe();
    }
  }

  subscribe() {
    this.subscription = this.subscribeToQueue().subscribe(
      (data: IMqttMessage) => {
        const XM = JSON.parse(data.payload.toString());
        this.shayanBehaviorSubject.next(XM);
      }
    );
  }

  subscribeToQueue(): Observable<IMqttMessage> {
    let customerTopic = `${this.topicIncoming}`;
    return this._mqttService.observe(customerTopic);
  }
}
